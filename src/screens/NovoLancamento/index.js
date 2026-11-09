import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import BotaoPrincipal from '../../components/BotaoPrincipal';
import CampoTexto from '../../components/CampoTexto';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIAS, CORES, ICONES_CATEGORIA, obterDataLocal } from '../../utils/formatacao';
import styles from './styles';

const NovoLancamento = ({ navigation, route }) => {
  const { adicionarMovimentacao, editarMovimentacao } = useFinance();
  const criarFormularioInicial = () => ({ tipo: 'despesa', descricao: '', valor: '', categoria: 'Alimentação', data: obterDataLocal() });
  const [form, setForm] = useState(() => route?.params?.movimentacao || criarFormularioInicial());
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [categoriasAbertas, setCategoriasAbertas] = useState(false);
  const editando = Boolean(form.id);
  useEffect(() => () => { if (navigation?.setParams) navigation.setParams({ movimentacao: undefined }); }, [navigation]);
  const alterar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));
  const salvar = async () => {
    const valor = Number(form.valor.replace(',', '.'));
    if (!form.descricao.trim() || !Number.isFinite(valor) || valor <= 0 || !form.data) { setErro('Preencha todos os campos e informe um valor maior que zero.'); return; }
    setErro(''); setSucesso(''); setCarregando(true);
    try {
      const dados = { ...form, descricao: form.descricao.trim(), valor };
      if (editando) await editarMovimentacao(form.id, dados);
      else await adicionarMovimentacao(dados);
      setForm(criarFormularioInicial());
      setCategoriasAbertas(false);
      setSucesso(`${editando ? 'Lançamento atualizado' : 'Lançamento salvo'} com sucesso.`);
    } catch (error) {
      setErro(error.message || 'Não foi possível salvar o lançamento.');
    } finally { setCarregando(false); }
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formCard}>
          <View style={styles.intro}>
            <View style={styles.introIcon}><Text style={styles.introIconText}>+</Text></View>
            <View><Text style={styles.title}>{editando ? 'Editar lançamento' : 'Novo lançamento'}</Text><Text style={styles.subtitle}>{editando ? 'Atualize os dados da movimentação' : 'Registre uma receita ou despesa'}</Text></View>
          </View>

          <Text style={styles.label}>Tipo de lançamento</Text>
          <View style={styles.typeSelector}>
            <Pressable onPress={() => alterar('tipo', 'despesa')} style={[styles.typeOption, form.tipo === 'despesa' && styles.expenseSelected]}>
              <Text style={[styles.typeIcon, form.tipo === 'despesa' && styles.selectedText]}>↓</Text>
              <View><Text style={[styles.typeTitle, form.tipo === 'despesa' && styles.selectedText]}>Despesa</Text><Text style={styles.typeHint}>Dinheiro que sai</Text></View>
            </Pressable>
            <Pressable onPress={() => alterar('tipo', 'receita')} style={[styles.typeOption, form.tipo === 'receita' && styles.incomeSelected]}>
              <Text style={[styles.typeIcon, form.tipo === 'receita' && styles.incomeText]}>↑</Text>
              <View><Text style={[styles.typeTitle, form.tipo === 'receita' && styles.incomeText]}>Receita</Text><Text style={styles.typeHint}>Dinheiro que entra</Text></View>
            </Pressable>
          </View>

          <CampoTexto label="Descrição" value={form.descricao} onChangeText={(value) => alterar('descricao', value)} placeholder="Ex.: Mercado, salário..." />
          <CampoTexto label="Valor" value={form.valor} onChangeText={(value) => alterar('valor', value)} keyboardType="decimal-pad" placeholder="R$ 0,00" />
          <Text style={styles.label}>Categoria</Text>
          <Pressable onPress={() => setCategoriasAbertas((aberta) => !aberta)} style={[styles.categorySelect, categoriasAbertas && styles.categorySelectOpen]}>
            <View style={styles.categorySelectedIcon}><Text style={styles.categoryIconText}>{ICONES_CATEGORIA[form.categoria]}</Text></View>
            <Text style={styles.categorySelectedText}>{form.categoria}</Text>
            <Text style={styles.categoryChevron}>{categoriasAbertas ? '⌃' : '⌄'}</Text>
          </Pressable>
          {categoriasAbertas ? <View style={styles.categoryGrid}>{CATEGORIAS.filter((item) => item !== 'Todas').map((item) => <Pressable key={item} onPress={() => { alterar('categoria', item); setCategoriasAbertas(false); }} style={[styles.categoryOption, form.categoria === item && styles.categoryOptionSelected]}><View style={[styles.categoryOptionIcon, form.categoria === item && styles.categoryOptionIconSelected]}><Text style={styles.categoryIconText}>{ICONES_CATEGORIA[item]}</Text></View><Text style={[styles.categoryOptionText, form.categoria === item && styles.categoryOptionTextSelected]}>{item}</Text></Pressable>)}</View> : null}
          <CampoTexto label="Data" value={form.data} onChangeText={(value) => alterar('data', value)} placeholder="AAAA-MM-DD" />
          {erro ? <Text style={styles.formError}>{erro}</Text> : null}
          {sucesso ? <Text accessibilityRole="alert" style={styles.formSuccess}>{sucesso}</Text> : null}
          <BotaoPrincipal title={editando ? 'Salvar alterações' : 'Salvar lançamento'} onPress={salvar} loading={carregando} />
          <Text style={styles.helper}>Os dados serão sincronizados com sua conta financeira.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NovoLancamento;
