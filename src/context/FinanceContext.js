import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  buscarTransacoes,
  cadastrarTransacao,
  atualizarTransacao,
  excluirTransacao,
  cadastrarUsuario,
  entrarUsuario,
  sairUsuario,
  buscarCategorias,
  buscarContaConjunta,
  convidarMembro,
  removerMembro,
  sairDaContaConjunta,
  buscarNotificacoes,
  marcarNotificacaoLida,
  registrarNotificacoesPush,
  supabase,
  buscarZeramentoAtual,
  zerarSaldoAtual,
} from '../services/api';

const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [contaConjunta, setContaConjunta] = useState(null);
  const [notificacoes, setNotificacoes] = useState([]);
  const [zeramento, setZeramento] = useState(null);
  const normalizarUsuario = (dados) => dados ? {
    ...dados,
    nome: dados.nome || dados.user_metadata?.full_name || dados.email,
  } : null;

  const carregarMovimentacoes = useCallback(async () => {
    if (!usuario) {
      setMovimentacoes([]);
      setZeramento(null);
      return;
    }
    setCarregando(true);
    setErro('');
    try {
      const [dados, marco] = await Promise.all([
        buscarTransacoes(usuario.id, contaConjunta?.id),
        buscarZeramentoAtual(),
      ]);
      setMovimentacoes(Array.isArray(dados) ? dados : []);
      setZeramento(marco);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }, [usuario, contaConjunta]);

  const registrarUsuario = useCallback(async ({ nome, email, senha }) => {
    setErro('');
    const resultado = await cadastrarUsuario({ email: email.trim().toLowerCase(), senha, nome });
    if (resultado.session) {
      setUsuario(normalizarUsuario(resultado.user));
      setCategorias(await buscarCategorias());
      setContaConjunta(await buscarContaConjunta());
      registrarNotificacoesPush().catch((error) => setErro(error.message));
    }
    return resultado;
  }, []);

  const entrar = useCallback(async ({ email, senha }) => {
    setErro('');
    const encontrado = await entrarUsuario({ email: email.trim().toLowerCase(), senha });
    setUsuario(normalizarUsuario(encontrado));
    setCategorias(await buscarCategorias());
    setContaConjunta(await buscarContaConjunta());
    registrarNotificacoesPush().catch((error) => setErro(error.message));
    return encontrado;
  }, []);

  const carregarNotificacoes = useCallback(async () => {
    if (!usuario) {
      setNotificacoes([]);
      setZeramento(null);
      return;
    }
    setNotificacoes(await buscarNotificacoes());
  }, [usuario]);

  const lerNotificacao = useCallback(async (id) => {
    await marcarNotificacaoLida(id);
    setNotificacoes((atuais) => atuais.map((item) => item.id === id ? { ...item, read_at: new Date().toISOString() } : item));
  }, []);

  useEffect(() => {
    if (!usuario) return undefined;
    carregarNotificacoes();
    const channel = supabase
      .channel(`notifications-${usuario.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${usuario.id}`,
      }, ({ new: notificacao }) => {
        setNotificacoes((atuais) => [notificacao, ...atuais.filter((item) => item.id !== notificacao.id)]);
      })
      .subscribe();
    const intervalo = setInterval(carregarNotificacoes, 5000);
    return () => {
      clearInterval(intervalo);
      supabase.removeChannel(channel);
    };
  }, [usuario, carregarNotificacoes]);

  const adicionarMovimentacao = useCallback(async (dados) => {
    if (!usuario) {
      throw new Error('Faça login para cadastrar um lançamento.');
    }
    setErro('');
    const transacao = { ...dados, userId: usuario.id };
    const nova = await cadastrarTransacao(transacao, categorias, contaConjunta?.id);
    setMovimentacoes((atuais) => [nova || { ...transacao, id: Date.now().toString() }, ...atuais]);
    return nova;
  }, [usuario, categorias, contaConjunta]);

  const editarMovimentacao = useCallback(async (id, dados) => {
    if (!usuario) throw new Error('Faça login para editar um lançamento.');
    const atualizada = await atualizarTransacao(id, { ...dados, userId: usuario.id }, categorias, contaConjunta?.id);
    setMovimentacoes((atuais) => atuais.map((item) => String(item.id) === String(id) ? atualizada : item));
    return atualizada;
  }, [usuario, categorias, contaConjunta]);

  const removerMovimentacao = useCallback(async (id) => {
    if (!usuario) throw new Error('Faça login para excluir um lançamento.');
    await excluirTransacao(id);
    setMovimentacoes((atuais) => atuais.filter((item) => String(item.id) !== String(id)));
  }, [usuario]);


  const sair = useCallback(async () => {
    try {
      await sairUsuario();
      setUsuario(null);
      setCategorias([]);
      setContaConjunta(null);
      setNotificacoes([]);
    } catch (error) {
      setErro(error.message);
    }
    setMovimentacoes([]);
    setErro('');
  }, []);

  const movimentacoesAtuais = useMemo(() => {
    if (!zeramento?.reset_at) return movimentacoes;
    const marco = new Date(zeramento.reset_at).getTime();
    return movimentacoes.filter((item) => new Date(item.created_at).getTime() >= marco);
  }, [movimentacoes, zeramento]);

  const totais = useMemo(() => {
    const receitas = movimentacoesAtuais
      .filter(({ tipo }) => tipo === 'receita')
      .reduce((total, { valor }) => total + Number(valor || 0), 0);
    const despesas = movimentacoesAtuais
      .filter(({ tipo }) => tipo === 'despesa')
      .reduce((total, { valor }) => total + Number(valor || 0), 0);
    return { receitas, despesas, saldo: receitas - despesas };
  }, [movimentacoesAtuais]);

  const donoDaConta = contaConjunta?.membros?.some((membro) => membro.user_id === usuario?.id && membro.role === 'owner');

  const valor = {
    usuario,
    categorias,
    contaConjunta,
    notificacoes,
    convidarMembro: async (email) => {
      await convidarMembro(email);
      setContaConjunta(await buscarContaConjunta());
    },
    removerMembro: async (userId) => {
      await removerMembro(userId);
      setContaConjunta(await buscarContaConjunta());
    },
    sairDaContaConjunta: async () => {
      await sairDaContaConjunta();
      setContaConjunta(null);
      setMovimentacoes([]);
      setNotificacoes([]);
    },
    movimentacoes,
    movimentacoesAtuais,
    zeramento,
    donoDaConta,
    carregando,
    erro,
    ...totais,
    registrarUsuario,
    entrar,
    adicionarMovimentacao,
    editarMovimentacao,
    removerMovimentacao,
    carregarMovimentacoes,
    carregarNotificacoes,
    lerNotificacao,
    zerarSaldoAtual: async () => {
      const resetAt = await zerarSaldoAtual();
      setZeramento({ reset_at: resetAt });
    },
    sair,
  };

  return <FinanceContext.Provider value={valor}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const contexto = useContext(FinanceContext);
  if (!contexto) throw new Error('useFinance deve ser usado dentro de FinanceProvider.');
  return contexto;
};
