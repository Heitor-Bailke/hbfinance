import React from 'react';
import { Text, View } from 'react-native';
import { formatarMoeda } from '../../utils/formatacao';
import styles from './styles';

const CardSaldo = ({ saldo, receitas, despesas }) => (
  <View style={styles.card}>
    <Text style={styles.caption}>SALDO DISPONÍVEL</Text>
    <Text style={styles.total}>{formatarMoeda(saldo)}</Text>
    <View style={styles.row}>
      <View><Text style={styles.label}>Receitas</Text><Text style={styles.receita}>{formatarMoeda(receitas)}</Text></View>
      <View><Text style={styles.label}>Gastos</Text><Text style={styles.despesa}>{formatarMoeda(despesas)}</Text></View>
    </View>
  </View>
);

export default CardSaldo;
