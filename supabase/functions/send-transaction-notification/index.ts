import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authorization = request.headers.get('Authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!authorization || !supabaseUrl || !anonKey || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Configuração da função incompleta.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: 'Não autenticado.' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { transactionId } = await request.json();
    if (!transactionId) {
      return new Response(JSON.stringify({ error: 'transactionId é obrigatório.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: transaction, error: transactionError } = await admin
      .from('transactions')
      .select('id, household_id, created_by, descricao, tipo')
      .eq('id', transactionId)
      .single();
    if (transactionError || !transaction) throw new Error('Lançamento não encontrado.');

    if (transaction.created_by !== authData.user.id) {
      const { data: owner } = await admin
        .from('household_members')
        .select('user_id')
        .eq('household_id', transaction.household_id)
        .eq('user_id', authData.user.id)
        .eq('role', 'owner')
        .maybeSingle();
      if (!owner) {
        return new Response(JSON.stringify({ error: 'Você não pode notificar este lançamento.' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    const { data: members, error: membersError } = await admin
      .from('household_members')
      .select('user_id')
      .eq('household_id', transaction.household_id)
      .neq('user_id', authData.user.id);
    if (membersError) throw membersError;
    const recipientIds = (members || []).map((member) => member.user_id);
    if (!recipientIds.length) return new Response(JSON.stringify({ sent: 0 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { data: tokens, error: tokensError } = await admin
      .from('device_push_tokens')
      .select('token')
      .in('user_id', recipientIds);
    if (tokensError) throw tokensError;
    const messages = (tokens || []).map(({ token }) => ({
      to: token,
      sound: 'default',
      title: 'Novo lançamento',
      body: `${transaction.tipo === 'receita' ? 'Receita' : 'Despesa'}: ${transaction.descricao}`,
      data: { transactionId: transaction.id },
    }));
    if (!messages.length) return new Response(JSON.stringify({ sent: 0 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });
    if (!response.ok) throw new Error(`Expo Push API respondeu ${response.status}.`);
    return new Response(JSON.stringify({ sent: messages.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Falha ao enviar notificações.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
