import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIAS, CORES, formatarMoeda } from '../../utils/formatacao';
import styles from './styles';

const mesAtual = new Date().toISOString().slice(0, 7);
const mesAnterior = (() => {
  const data = new Date();
  data.setMonth(data.getMonth() - 1);
  return data.toISOString().slice(0, 7);
})();

const intervaloValido = (inicio, fim) => /^\d{4}-(0[1-9]|1[0-2])$/.test(inicio)
  && /^\d{4}-(0[1-9]|1[0-2])$/.test(fim)
  && inicio <= fim;

const filtrarPeriodo = (movimentacoes, inicio, fim) => movimentacoes.filter((item) => {
  const mes = String(item.data || '').slice(0, 7);
  return mes >= inicio && mes <= fim;
});

const calcularResumo = (movimentacoes) => {
  const receitas = movimentacoes.filter(({ tipo }) => tipo === 'receita')
    .reduce((total, { valor }) => total + Number(valor || 0), 0);
  const despesas = movimentacoes.filter(({ tipo }) => tipo === 'despesa')
    .reduce((total, { valor }) => total + Number(valor || 0), 0);
  return { receitas, despesas, saldo: receitas - despesas };
};

const Relatorios = ({ navigation }) => {
  const { movimentacoes } = useFinance();
  const [inicio, setInicio] = useState(mesAtual);
  const [fim, setFim] = useState(mesAtual);
  const [inicioComparacao, setInicioComparacao] = useState(mesAnterior);
  const [fimComparacao, setFimComparacao] = useState(mesAnterior);

  const periodoValido = intervaloValido(inicio, fim);
  const comparacaoValida = intervaloValido(inicioComparacao, fimComparacao);
  const resumo = useMemo(() => calcularResumo(filtrarPeriodo(movimentacoes, inicio, fim)), [movimentacoes, inicio, fim]);
  const resumoComparacao = useMemo(() => calcularResumo(filtrarPeriodo(movimentacoes, inicioComparacao, fimComparacao)), [movimentacoes, inicioComparacao, fimComparacao]);
  const porCategoria = useMemo(() => CATEGORIAS
    .filter((item) => item !== 'Todas')
    .map((categoria) => ({
      categoria,
      valor: filtrarPeriodo(movimentacoes, inicio, fim)
        .filter((item) => item.categoria === categoria && item.tipo === 'despesa')
        .reduce((total, item) => total + Number(item.valor || 0), 0),
    }))
    .filter((item) => item.valor > 0), [movimentacoes, inicio, fim]);

  const variacao = (atual, anterior) => anterior === 0 ? (atual === 0 ? '0,00%' : 'Novo') : `${(((atual - anterior) / Math.abs(anterior)) * 100).toFixed(2).replace('.', ',')}%`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Dashboard'))}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>‹ Voltar</Text>
      </Pressable>
      <Text style={styles.title}>Relatórios</Text>
      <View style={styles.periodCard}>
        <Text style={styles.periodTitle}>Período principal</Text>
        <Text style={styles.periodHint}>Informe os meses no formato AAAA-MM</Text>
        <View style={styles.periodRow}>
          <View style={styles.periodField}><Text style={styles.label}>De</Text><TextInput value={inicio} onChangeText={setInicio} style={styles.periodInput} placeholder="2026-01" maxLength={7} /></View>
          <View style={styles.periodField}><Text style={styles.label}>Até</Text><TextInput value={fim} onChangeText={setFim} style={styles.periodInput} placeholder="2026-11" maxLength={7} /></View>
        </View>
        {!periodoValido ? <Text style={styles.error}>Informe meses válidos e o início deve ser anterior ao fim.</Text> : null}
        <Text style={styles.periodTitle}>Comparar com</Text>
        <View style={styles.periodRow}>
          <View style={styles.periodField}><Text style={styles.label}>De</Text><TextInput value={inicioComparacao} onChangeText={setInicioComparacao} style={styles.periodInput} placeholder="2025-01" maxLength={7} /></View>
          <View style={styles.periodField}><Text style={styles.label}>Até</Text><TextInput value={fimComparacao} onChangeText={setFimComparacao} style={styles.periodInput} placeholder="2025-11" maxLength={7} /></View>
        </View>
        {!comparacaoValida ? <Text style={styles.error}>Informe um intervalo de comparação válido.</Text> : null}
      </View>

      <Text style={styles.periodLabel}>Resumo de {inicio} até {fim}</Text>
      {periodoValido ? <View style={styles.summary}>
        <View><Text style={styles.label}>Receitas</Text><Text style={styles.receita}>{formatarMoeda(resumo.receitas)}</Text></View>
        <View><Text style={styles.label}>Gastos</Text><Text style={styles.despesa}>{formatarMoeda(resumo.despesas)}</Text></View>
        <View><Text style={styles.label}>Saldo do período</Text><Text style={styles.saldo}>{formatarMoeda(resumo.saldo)}</Text></View>
      </View> : <Text style={styles.empty}>Corrija o período principal para visualizar o resumo.</Text>}

      <Text style={styles.heading}>Comparação financeira</Text>
      {comparacaoValida && periodoValido ? <View style={styles.comparison}>
        <Text style={styles.comparisonPeriod}>{inicioComparacao} até {fimComparacao}</Text>
        <Text style={styles.comparisonText}>Receitas: {formatarMoeda(resumoComparacao.receitas)} ({variacao(resumo.receitas, resumoComparacao.receitas)})</Text>
        <Text style={styles.comparisonText}>Gastos: {formatarMoeda(resumoComparacao.despesas)} ({variacao(resumo.despesas, resumoComparacao.despesas)})</Text>
        <Text style={styles.comparisonText}>Saldo: {formatarMoeda(resumoComparacao.saldo)} ({variacao(resumo.saldo, resumoComparacao.saldo)})</Text>
      </View> : <Text style={styles.empty}>Informe períodos válidos para comparar os resultados.</Text>}

      <Text style={styles.heading}>Gastos por categoria</Text>
      {porCategoria.length ? porCategoria.map((item) => <View key={item.categoria} style={styles.item}><Text style={styles.itemLabel}>{item.categoria}</Text><Text style={styles.itemValue}>{formatarMoeda(item.valor)}</Text></View>) : <Text style={styles.empty}>Cadastre gastos no período para visualizar o relatório.</Text>}
    </ScrollView>
  );
};

export default Relatorios;
