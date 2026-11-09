import { StyleSheet } from 'react-native';
import { CORES } from '../../utils/formatacao';

export default StyleSheet.create({
  button: { alignItems: 'center', backgroundColor: CORES.verde, borderRadius: 10, minHeight: 48, justifyContent: 'center', marginTop: 8, paddingHorizontal: 18 },
  secondary: { backgroundColor: CORES.branco, borderColor: CORES.azul, borderWidth: 1 },
  text: { color: CORES.marinho, fontSize: 16, fontWeight: '700' },
  secondaryText: { color: CORES.azul },
});
