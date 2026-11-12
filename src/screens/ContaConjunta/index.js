import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import BotaoPrincipal from '../../components/BotaoPrincipal';
import CampoTexto from '../../components/CampoTexto';
import { useFinance } from '../../context/FinanceContext';
import styles from './styles';

const ContaConjunta = () => {
  const { contaConjunta, convidarMembro } = useFinance();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

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
      <View style={styles.card}>
        <Text style={styles.title}>Conta conjunta</Text>
        <Text style={styles.subtitle}>Adicione alguém que já possui cadastro para compartilhar os lançamentos.</Text>
        <CampoTexto label="E-mail do integrante" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="pessoa@exemplo.com" />
        {erro ? <Text style={styles.error}>{erro}</Text> : null}
        <BotaoPrincipal title="Adicionar integrante" onPress={adicionar} loading={carregando} />
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Integrantes</Text>
        {(contaConjunta?.membros || []).map((membro) => (
          <View key={membro.user_id} style={styles.member}>
            <Text style={styles.memberName}>{membro.profiles?.full_name || 'Integrante'}</Text>
            <Text style={styles.memberRole}>{membro.role === 'owner' ? 'Dono da conta' : 'Integrante'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ContaConjunta;
