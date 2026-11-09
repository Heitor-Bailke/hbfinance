import { StyleSheet } from 'react-native';
import { CORES } from '../../utils/formatacao';

export default StyleSheet.create({
  container: { backgroundColor: CORES.cinza, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 760, padding: 24, width: '100%' },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  headerActions: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  greeting: { color: CORES.cinzaTexto, fontSize: 13 }, name: { color: CORES.marinho, fontSize: 25, fontWeight: '800', marginTop: 3 },
  logout: { borderColor: CORES.vermelho, borderRadius: 8, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 10 }, logoutText: { color: CORES.vermelho, fontSize: 13, fontWeight: '700' },
  add: { alignItems: 'center', backgroundColor: CORES.marinho, borderRadius: 8, height: 42, justifyContent: 'center', width: 42 }, addText: { color: CORES.branco, fontSize: 25, lineHeight: 28 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }, sectionTitle: { color: CORES.marinho, fontSize: 18, fontWeight: '800' }, link: { color: CORES.azul, fontSize: 13, fontWeight: '700' },
  empty: { color: CORES.cinzaTexto, paddingVertical: 24, textAlign: 'center' }, cta: { alignItems: 'center', backgroundColor: CORES.azul, borderRadius: 8, marginTop: 18, padding: 15 }, ctaText: { color: CORES.branco, fontWeight: '700' }, apiHint: { color: CORES.vermelho, fontSize: 12, marginTop: 14, textAlign: 'center' },
  error: { backgroundColor: CORES.vermelhoClaro, borderColor: CORES.vermelho, borderRadius: 8, borderWidth: 1, color: CORES.vermelho, fontSize: 13, marginTop: 14, padding: 12, textAlign: 'center' },
});
