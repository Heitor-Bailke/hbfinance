import React, { useCallback, useEffect } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import CardMovimentacao from '../../components/CardMovimentacao';
import CardSaldo from '../../components/CardSaldo';
import { useFinance } from '../../context/FinanceContext';
import { CORES } from '../../utils/formatacao';
import styles from './styles';

const Dashboard = ({ navigation }) => {
  const { usuario, movimentacoes, receitas, despesas, saldo, carregarMovimentacoes, carregando, erro, sair } = useFinance();
  useEffect(() => { carregarMovimentacoes(); }, [carregarMovimentacoes]);
  const atualizar = useCallback(() => carregarMovimentacoes(), [carregarMovimentacoes]);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={carregando} onRefresh={atualizar} />}>
      <View style={styles.header}>
        <View><Text style={styles.greeting}>Olá,</Text><Text style={styles.name}>{usuario?.nome || 'usuário'}</Text></View>
        <View style={styles.headerActions}>
          <Pressable accessibilityRole="button" accessibilityLabel="Sair da conta" onPress={sair} style={styles.logout}>
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Adicionar lançamento" onPress={() => navigation.navigate('NovoLancamento')} style={styles.add}>
            <Text style={styles.addText}>+</Text>
          </Pressable>
        </View>
      </View>
      <CardSaldo saldo={saldo} receitas={receitas} despesas={despesas} />
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Extrato recente</Text><Pressable onPress={() => navigation.navigate('Lançamentos')}><Text style={styles.link}>Ver tudo</Text></Pressable></View>
      {movimentacoes.length ? movimentacoes.slice(0, 5).map((item) => <CardMovimentacao key={item.id} movimentacao={item} />) : <Text style={styles.empty}>Nenhuma movimentação cadastrada.</Text>}
      <Pressable onPress={() => navigation.navigate('NovoLancamento')} style={styles.cta}><Text style={styles.ctaText}>Adicionar lançamento</Text></Pressable>
      {erro && !erro.includes('Configure') ? <Text accessibilityRole="alert" style={styles.error}>{erro}</Text> : null}
      <Text style={styles.apiHint}>{erro && erro.includes('Configure') ? erro : ''}</Text>
    </ScrollView>
  );
};

export default Dashboard;
