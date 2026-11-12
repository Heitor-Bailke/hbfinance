import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import BotaoPrincipal from '../../components/BotaoPrincipal';
import CampoTexto from '../../components/CampoTexto';
import { useFinance } from '../../context/FinanceContext';
import styles from './styles';

const ContaConjunta = ({ navigation }) => {
  const { contaConjunta, convidarMembro, removerMembro, sairDaContaConjunta, usuario } = useFinance();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const souDono = contaConjunta?.membros?.some((membro) => membro.user_id === usuario?.id && membro.role === 'owner');

  const adicionar = async () => {
    if (!email.trim()) {
      setErro('Informe o e-mail do integrante.');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      await convidarMembro(email);
      setEmail('');
      Alert.alert('Integrante adicionado', 'A conta já pode acompanhar e lançar movimentações.');
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

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
      <View style={styles.card}>
        <Text style={styles.title}>Conta conjunta</Text>
        <Text style={styles.subtitle}>Adicione alguém que já possui cadastro para compartilhar os lançamentos.</Text>
        {souDono ? <><CampoTexto label="E-mail do integrante" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="pessoa@exemplo.com" />
          <BotaoPrincipal title="Adicionar integrante" onPress={adicionar} loading={carregando} /></> : <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert('Sair da conta conjunta', 'Se você sair, seus lançamentos permanecerão na conta conjunta.', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sair', style: 'destructive', onPress: async () => {
                try {
                  await sairDaContaConjunta();
                  Alert.alert('Conta conjunta', 'Você saiu da conta conjunta.');
                  navigation.navigate('Dashboard');
                } catch (error) {
                  setErro(error.message);
                }
              } },
            ])}
          >
            <Text style={styles.leaveText}>Sair da conta conjunta</Text>
          </Pressable>}
        {erro ? <Text style={styles.error}>{erro}</Text> : null}
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Integrantes</Text>
        {(contaConjunta?.membros || []).map((membro) => (
          <View key={membro.user_id} style={styles.member}>
            <View>
              <Text style={styles.memberName}>{membro.profiles?.full_name || 'Integrante'}</Text>
              <Text style={styles.memberRole}>{membro.role === 'owner' ? 'Dono da conta' : 'Integrante'}</Text>
            </View>
            {membro.role === 'member' && souDono ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => Alert.alert('Remover integrante', 'Remover este integrante da conta conjunta?', [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Remover', style: 'destructive', onPress: async () => {
                    try {
                      await removerMembro(membro.user_id);
                    } catch (error) {
                      Alert.alert('Erro', error.message);
                    }
                  } },
                ])}
              >
                <Text style={styles.removeText}>Remover</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ContaConjunta;
