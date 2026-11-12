import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sqimnwaibsygkcqmrcwg.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_9BvIAJXyGstQxw0kscsO9A_VQytmcIC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const toTransaction = (item) => ({
  ...item,
  userId: item.user_id,
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
  return toTransaction(data);
};

export const atualizarTransacao = async (id, transacao, categorias = [], householdId) => {
  const usuario = await obterUsuarioAutenticado();
  const categoryMap = new Map(categorias.map((item) => [item.name, item.id]));
  const { data, error } = await supabase
    .from('transactions')
    .update(fromTransaction(transacao, usuario.id, categoryMap, householdId))
    .eq('id', id)
    .eq('user_id', usuario.id)
    .select('*, categories(id, name), created_by_profile:profiles!transactions_created_by_profile_fkey(full_name)')
    .single();
  if (error) throw new Error(error.message);
  return toTransaction(data);
};

export const excluirTransacao = async (id) => {
  const usuario = await obterUsuarioAutenticado();
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', usuario.id);
  if (error) throw new Error(error.message);
};
