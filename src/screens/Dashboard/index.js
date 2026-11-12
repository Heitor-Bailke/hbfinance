import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import CardMovimentacao from '../../components/CardMovimentacao';
import CardSaldo from '../../components/CardSaldo';
import { useFinance } from '../../context/FinanceContext';
import { CORES } from '../../utils/formatacao';
import styles from './styles';

const Dashboard = ({ navigation }) => {
  const { usuario, movimentacoesAtuais, receitas, despesas, saldo, carregarMovimentacoes, carregando, erro, sair, donoDaConta, zerarSaldoAtual } = useFinance();
  useFocusEffect(useCallback(() => {
    carregarMovimentacoes();
  }, [carregarMovimentacoes]));
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
      {donoDaConta ? <Pressable
        accessibilityRole="button"
        onPress={() => Alert.alert('Zerar saldo atual', 'O saldo atual será zerado no Dashboard, mas os lançamentos continuarão disponíveis nos relatórios.', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Zerar saldo', style: 'destructive', onPress: async () => {
            try {
              await zerarSaldoAtual();
            } catch (error) {
              Alert.alert('Erro', error.message);
            }
          } },
        ])}
        style={styles.resetButton}
      >
        <Text style={styles.resetButtonText}>Zerar saldo atual</Text>
      </Pressable> : null}
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Extrato recente</Text><Pressable onPress={() => navigation.navigate('Lançamentos')}><Text style={styles.link}>Ver tudo</Text></Pressable></View>
      {movimentacoesAtuais.length ? movimentacoesAtuais.slice(0, 5).map((item) => <CardMovimentacao key={item.id} movimentacao={item} />) : <Text style={styles.empty}>Nenhuma movimentação cadastrada desde o último zeramento.</Text>}
      <Pressable onPress={() => navigation.navigate('NovoLancamento')} style={styles.cta}><Text style={styles.ctaText}>Adicionar lançamento</Text></Pressable>
      {erro && !erro.includes('Configure') ? <Text accessibilityRole="alert" style={styles.error}>{erro}</Text> : null}
      <Text style={styles.apiHint}>{erro && erro.includes('Configure') ? erro : ''}</Text>
    </ScrollView>
  );
};

export default Dashboard;
