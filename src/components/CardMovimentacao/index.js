import React from 'react';
import { Text, View } from 'react-native';
import { CORES, formatarData, formatarMoeda } from '../../utils/formatacao';
import styles from './styles';

const CardMovimentacao = ({ movimentacao }) => {
  const { descricao, categoria, data, tipo, valor } = movimentacao;
  const receita = tipo === 'receita';
  return (
    <View style={styles.card}>
      <View style={[styles.icon, { backgroundColor: receita ? '#D9F3EE' : '#FEE4E2' }]}><Text style={[styles.iconText, { color: receita ? CORES.verde : CORES.vermelho }]}>{receita ? '↗' : '↘'}</Text></View>
      <View style={styles.info}><Text style={styles.descricao}>{descricao}</Text><Text style={styles.meta}>{categoria} • {formatarData(data)}</Text></View>
      <Text numberOfLines={1} style={[styles.valor, { color: receita ? CORES.verde : CORES.vermelho }]}>{receita ? '+' : '-'} {formatarMoeda(valor)}</Text>
    </View>
  );
};

export default CardMovimentacao;
