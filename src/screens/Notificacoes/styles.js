import { StyleSheet } from 'react-native';
import { CORES } from '../../utils/formatacao';

export default StyleSheet.create({
  container: { backgroundColor: CORES.cinza, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 760, padding: 24, width: '100%' },
  title: { color: CORES.marinho, fontSize: 25, fontWeight: '800', marginBottom: 18 },
  item: { backgroundColor: CORES.branco, borderColor: CORES.borda, borderRadius: 12, borderWidth: 1, marginBottom: 10, padding: 16 },
  unread: { borderColor: CORES.azul, borderWidth: 2 },
  itemHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemTitle: { color: CORES.marinho, flex: 1, fontSize: 15, fontWeight: '800' },
  itemDate: { color: CORES.cinzaTexto, fontSize: 11, marginLeft: 8 },
  itemBody: { color: CORES.texto, lineHeight: 20 },
  empty: { color: CORES.cinzaTexto },
});
