import { createClient } from '@supabase/supabase-js';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const SUPABASE_URL = 'https://sqimnwaibsygkcqmrcwg.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_9BvIAJXyGstQxw0kscsO9A_VQytmcIC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const toTransaction = (item) => ({
  ...item,
  userId: item.user_id,
  createdBy: item.created_by,
  autorNome: item.created_by_profile?.full_name || 'Integrante',
  categoria: item.categories?.name || item.categoria,
});

const fromTransaction = ({ householdId, categoria, categoryId, descricao, valor, tipo, data }, authenticatedUserId, categoryMap, activeHouseholdId) => ({
  user_id: authenticatedUserId,
  household_id: activeHouseholdId || householdId,
  created_by: authenticatedUserId,
  categoria: categoria || (categoryId ? [...categoryMap.entries()].find(([, id]) => id === categoryId)?.[0] : null),
  category_id: categoryId || categoryMap?.get(categoria) || null,
  descricao,
  valor,
  tipo,
  data,
});

const camposEditaveis = ({ categoria, categoryId, descricao, valor, tipo, data }, categoryMap) => ({
  categoria: categoria || (categoryId ? [...categoryMap.entries()].find(([, id]) => id === categoryId)?.[0] : null),
  category_id: categoryId || categoryMap?.get(categoria) || null,
  descricao,
  valor,
  tipo,
  data,
});

const obterUsuarioAutenticado = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Sua sessão expirou. Entre novamente.');
  return data.user;
};

export const cadastrarUsuario = async ({ email, senha, nome }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { full_name: nome } },
  });
  if (error) {
    const mensagem = error.message.toLowerCase();
    if (error.code === 'user_already_exists' || mensagem.includes('user already registered')) {
      throw new Error('Este e-mail já foi usado para cadastro.');
    }
    throw new Error(error.message);
  }
  return data;
};

export const entrarUsuario = async ({ email, senha }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) throw new Error('E-mail ou senha inválidos.');
  return data.user;
};

export const buscarCategorias = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, kind')
    .order('name');
  if (error) throw new Error(error.message);
  return data || [];
};

export const buscarContaConjunta = async () => {
  const usuario = await obterUsuarioAutenticado();
  const { data, error } = await supabase
    .from('household_members')
    .select('household_id, households(id, name), profiles:user_id(id, full_name)')
    .eq('user_id', usuario.id)
    .limit(1)
    .single();
  if (error) throw new Error(error.message);
  const { data: membros, error: erroMembros } = await supabase
    .from('household_members')
    .select('user_id, role, profiles:user_id(id, full_name)')
    .eq('household_id', data.household_id);
  if (erroMembros) throw new Error(erroMembros.message);
  return { id: data.household_id, nome: data.households?.name || 'Conta familiar', membros: membros || [] };
};

export const convidarMembro = async (email) => {
  const { error } = await supabase.rpc('invite_household_member', { member_email: email.trim().toLowerCase() });
  if (error) throw new Error(error.message);
};

export const removerMembro = async (userId) => {
  const { error } = await supabase.rpc('remove_household_member', { target_user: userId });
  if (error) throw new Error(error.message);
};

export const sairDaContaConjunta = async () => {
  const { error } = await supabase.rpc('leave_household');
  if (error) throw new Error(error.message);
};

export const buscarZeramentoAtual = async () => {
  const { data, error } = await supabase
    .from('balance_resets')
    .select('reset_at, balance_before')
    .order('reset_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
};

export const zerarSaldoAtual = async () => {
  const { data, error } = await supabase.rpc('reset_current_balance');
  if (error) throw new Error(error.message);
  return data;
};

export const sairUsuario = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const buscarTransacoes = async (userId, householdId) => {
  const usuario = await obterUsuarioAutenticado();
  let consulta = supabase
    .from('transactions')
    .select('*, categories(id, name), created_by_profile:profiles!transactions_created_by_profile_fkey(full_name)')
    .order('data', { ascending: false });
  consulta = householdId
    ? consulta.eq('household_id', householdId)
    : consulta.eq('user_id', usuario.id);
  const { data, error } = await consulta;
  if (error) throw new Error(error.message);
  return (data || []).map(toTransaction);
};

export const cadastrarTransacao = async (transacao, categorias = [], householdId) => {
  const usuario = await obterUsuarioAutenticado();
  const categoryMap = new Map(categorias.map((item) => [item.name, item.id]));
  const { data, error } = await supabase
    .from('transactions')
    .insert(fromTransaction(transacao, usuario.id, categoryMap, householdId))
    .select('*, categories(id, name), created_by_profile:profiles!transactions_created_by_profile_fkey(full_name)')
    .single();
  if (error) throw new Error(error.message);
  await solicitarPushDoLancamento(data.id);
  return toTransaction(data);
};

export const atualizarTransacao = async (id, transacao, categorias = [], householdId) => {
  await obterUsuarioAutenticado();
  const categoryMap = new Map(categorias.map((item) => [item.name, item.id]));
  const { data, error } = await supabase
    .from('transactions')
    .update(camposEditaveis(transacao, categoryMap))
    .eq('id', id)
    .select('*, categories(id, name), created_by_profile:profiles!transactions_created_by_profile_fkey(full_name)')
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Apenas o criador do lançamento ou o dono da conta pode editar.');
  return toTransaction(data);
};

export const excluirTransacao = async (id) => {
  await obterUsuarioAutenticado();
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
};

export const buscarNotificacoes = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, body, read_at, created_at, transaction_id')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
};

export const marcarNotificacaoLida = async (id) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
};

export const registrarNotificacoesPush = async () => {
  if (!Device.isDevice) return;
  const { status: statusAtual } = await Notifications.getPermissionsAsync();
  let status = statusAtual;
  if (status !== 'granted') {
    const resultado = await Notifications.requestPermissionsAsync();
    status = resultado.status;
  }
  if (status !== 'granted') throw new Error('Permissão de notificações não concedida.');
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  const { data: plataforma } = await supabase.auth.getSession();
  if (!plataforma.session?.user) throw new Error('Sua sessão expirou. Entre novamente.');
  const { error } = await supabase.from('device_push_tokens').upsert({
    user_id: plataforma.session.user.id,
    token,
    platform: Device.osName || 'unknown',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'token' });
  if (error) throw new Error(error.message);
};

export const solicitarPushDoLancamento = async (transactionId) => {
  const { error } = await supabase.functions.invoke('send-transaction-notification', {
    body: { transactionId },
  });
  if (error) console.warn('Push do lançamento não enviado:', error.message);
};
