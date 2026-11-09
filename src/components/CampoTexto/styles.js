import { StyleSheet } from 'react-native';
import { CORES } from '../../utils/formatacao';

export default StyleSheet.create({
  container: { marginBottom: 14 },
  label: { color: CORES.texto, fontSize: 14, fontWeight: '600', marginBottom: 7 },
  input: { backgroundColor: CORES.branco, borderColor: '#CBD5E1', borderRadius: 10, borderWidth: 1, color: CORES.texto, fontSize: 16, padding: 13 },
  inputErro: { borderColor: CORES.vermelho },
  erro: { color: CORES.vermelho, fontSize: 12, marginTop: 4 },
});
