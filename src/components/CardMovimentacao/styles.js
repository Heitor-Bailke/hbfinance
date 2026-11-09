import { StyleSheet } from 'react-native';
import { CORES } from '../../utils/formatacao';

export default StyleSheet.create({
  card: { alignItems: 'center', backgroundColor: CORES.branco, borderColor: '#E8ECF2', borderRadius: 10, borderWidth: 1, flexDirection: 'row', marginBottom: 8, minHeight: 70, paddingHorizontal: 14, paddingVertical: 13 },
  icon: { alignItems: 'center', borderRadius: 8, height: 36, justifyContent: 'center', marginRight: 12, width: 36 },
  iconText: { fontSize: 20, fontWeight: '800' },
  info: { flex: 1, minWidth: 0, paddingRight: 12 },
  descricao: { color: CORES.texto, fontSize: 14, fontWeight: '700' },
  meta: { color: CORES.cinzaTexto, fontSize: 12, marginTop: 4 },
  valor: { flexShrink: 0, fontSize: 14, fontWeight: '800', minWidth: 105, textAlign: 'right' },
});
