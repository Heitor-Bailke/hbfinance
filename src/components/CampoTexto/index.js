import React from 'react';
import { Text, TextInput, View } from 'react-native';
import styles from './styles';

const CampoTexto = ({ label, erro, ...props }) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={[styles.input, erro && styles.inputErro]} placeholderTextColor="#94A3B8" {...props} />
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
  </View>
);

export default CampoTexto;
