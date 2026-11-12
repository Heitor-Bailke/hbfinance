import React, { useCallback } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useFinance } from '../../context/FinanceContext';
import styles from './styles';

const Notificacoes = () => {
  const { notificacoes, carregarNotificacoes, lerNotificacao } = useFinance();

  useFocusEffect(useCallback(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={carregarNotificacoes} />}
    >
      <Text style={styles.title}>Notificações</Text>
      {notificacoes.length ? notificacoes.map((notificacao) => (
        <Pressable
          key={notificacao.id}
          accessibilityRole="button"
          onPress={() => !notificacao.read_at && lerNotificacao(notificacao.id)}
          style={[styles.item, !notificacao.read_at && styles.unread]}
        >
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{notificacao.title}</Text>
            <Text style={styles.itemDate}>{new Date(notificacao.created_at).toLocaleString('pt-BR')}</Text>
          </View>
          <Text style={styles.itemBody}>{notificacao.body}</Text>
        </Pressable>
      )) : <Text style={styles.empty}>Nenhuma notificação nova.</Text>}
    </ScrollView>
  );
};

export default Notificacoes;
