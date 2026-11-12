import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sqimnwaibsygkcqmrcwg.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_9BvIAJXyGstQxw0kscsO9A_VQytmcIC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const toTransaction = (item) => ({
  ...item,
  userId: item.user_id,
  categoria: item.categories?.name || item.categoria,
});

const fromTransaction = ({ userId, categoria, categoryId, ...item }, authenticatedUserId, categoryMap) => ({
  ...item,
  user_id: authenticatedUserId,
  category_id: categoryId || categoryMap?.get(categoria) || null,
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

export const sairUsuario = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const buscarTransacoes = async (userId) => {
  const usuario = await obterUsuarioAutenticado();
  const { data, error } = await supabase
    .from('transactions')
    .select('*, categories(id, name)')
    .eq('user_id', usuario.id)
    .order('data', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(toTransaction);
};

export const cadastrarTransacao = async (transacao, categorias = []) => {
  const usuario = await obterUsuarioAutenticado();
  const categoryMap = new Map(categorias.map((item) => [item.name, item.id]));
  const { data, error } = await supabase
    .from('transactions')
    .insert(fromTransaction(transacao, usuario.id, categoryMap))
    .select('*, categories(id, name)')
    .single();
  if (error) throw new Error(error.message);
  return toTransaction(data);
};

export const atualizarTransacao = async (id, transacao, categorias = []) => {
  const usuario = await obterUsuarioAutenticado();
  const categoryMap = new Map(categorias.map((item) => [item.name, item.id]));
  const { data, error } = await supabase
    .from('transactions')
    .update(fromTransaction(transacao, usuario.id, categoryMap))
    .eq('id', id)
    .eq('user_id', usuario.id)
    .select('*, categories(id, name)')
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
