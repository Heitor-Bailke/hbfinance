import { StyleSheet } from 'react-native';
import { CORES } from '../../utils/formatacao';

export default StyleSheet.create({
  card: { backgroundColor: CORES.marinho, borderRadius: 12, marginBottom: 28, padding: 24 },
  caption: { color: '#B8C2D1', fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
  total: { color: CORES.branco, fontSize: 34, fontWeight: '800', marginBottom: 22, marginTop: 8 },
  row: { borderTopColor: '#334155', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 18 },
  label: { color: '#B8C2D1', fontSize: 12, marginBottom: 5 },
  receita: { color: '#7DD3C1', fontWeight: '800' },
  despesa: { color: '#FCA5A5', fontWeight: '800' },
});
