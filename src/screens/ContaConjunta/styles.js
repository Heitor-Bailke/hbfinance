import { StyleSheet } from 'react-native';
import { CORES } from '../../utils/formatacao';

export default StyleSheet.create({
  container: { backgroundColor: CORES.cinza, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 760, padding: 24, width: '100%' },
  backButton: { alignSelf: 'flex-start', marginBottom: 14, paddingVertical: 4 },
  backButtonText: { color: CORES.azul, fontSize: 14, fontWeight: '700' },
  card: { backgroundColor: CORES.branco, borderColor: CORES.borda, borderRadius: 12, borderWidth: 1, marginBottom: 16, padding: 20 },
  title: { color: CORES.marinho, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: CORES.cinzaTexto, lineHeight: 20, marginBottom: 12 },
  error: { color: CORES.vermelho, fontSize: 13, marginTop: 8 },
  sectionTitle: { color: CORES.marinho, fontSize: 18, fontWeight: '800', marginBottom: 12 },
  member: { borderTopColor: CORES.borda, borderTopWidth: 1, paddingVertical: 12 },
  memberName: { color: CORES.texto, fontSize: 15, fontWeight: '700' },
  memberRole: { color: CORES.cinzaTexto, fontSize: 12, marginTop: 3 },
});
