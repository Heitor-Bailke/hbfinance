import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
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
} from '../services/api';

const FinanceContext = createContext(null);

export const FinanceProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [contaConjunta, setContaConjunta] = useState(null);
  const normalizarUsuario = (dados) => dados ? {
    ...dados,
    nome: dados.nome || dados.user_metadata?.full_name || dados.email,
  } : null;

  const carregarMovimentacoes = useCallback(async () => {
    if (!usuario) {
      setMovimentacoes([]);
      return;
    }
    setCarregando(true);
    setErro('');
    try {
      const dados = await buscarTransacoes(usuario.id, contaConjunta?.id);
      setMovimentacoes(Array.isArray(dados) ? dados : []);
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
    }
    return resultado;
  }, []);

  const entrar = useCallback(async ({ email, senha }) => {
    setErro('');
    const encontrado = await entrarUsuario({ email: email.trim().toLowerCase(), senha });
    setUsuario(normalizarUsuario(encontrado));
    setCategorias(await buscarCategorias());
    setContaConjunta(await buscarContaConjunta());
    return encontrado;
  }, []);

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
    } catch (error) {
      setErro(error.message);
    }
    setMovimentacoes([]);
    setErro('');
  }, []);

  const totais = useMemo(() => {
    const receitas = movimentacoes
      .filter(({ tipo }) => tipo === 'receita')
      .reduce((total, { valor }) => total + Number(valor || 0), 0);
    const despesas = movimentacoes
      .filter(({ tipo }) => tipo === 'despesa')
      .reduce((total, { valor }) => total + Number(valor || 0), 0);
    return { receitas, despesas, saldo: receitas - despesas };
  }, [movimentacoes]);

  const valor = {
    usuario,
    categorias,
    contaConjunta,
    convidarMembro: async (email) => {
      await convidarMembro(email);
      setContaConjunta(await buscarContaConjunta());
    },
    movimentacoes,
    carregando,
    erro,
    ...totais,
    registrarUsuario,
    entrar,
    adicionarMovimentacao,
    editarMovimentacao,
    removerMovimentacao,
    carregarMovimentacoes,
    sair,
  };

  return <FinanceContext.Provider value={valor}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const contexto = useContext(FinanceContext);
  if (!contexto) throw new Error('useFinance deve ser usado dentro de FinanceProvider.');
  return contexto;
};
