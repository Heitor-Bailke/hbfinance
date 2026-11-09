import { StyleSheet } from 'react-native';
import { CORES } from '../../utils/formatacao';

export default StyleSheet.create({
  container: { backgroundColor: CORES.marinho, flex: 1 },
  content: { padding: 26, paddingTop: 70 },
  logo: { color: CORES.verde, fontSize: 44, fontWeight: '900' },
  title: { color: CORES.branco, fontSize: 25, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#CBD5E1', fontSize: 15, marginTop: 7 },
  form: { backgroundColor: CORES.cinza, borderRadius: 18, marginTop: 32, padding: 20 },
  heading: { color: CORES.marinho, fontSize: 21, fontWeight: '800', marginBottom: 18 },
  erroCadastro: { backgroundColor: CORES.vermelhoClaro, borderColor: CORES.vermelho, borderRadius: 10, borderWidth: 1, color: CORES.vermelho, fontSize: 13, lineHeight: 19, marginBottom: 8, padding: 12 },
  sucessoCadastro: { backgroundColor: CORES.verdeClaro, borderColor: CORES.verde, borderRadius: 10, borderWidth: 1, color: CORES.verde, fontSize: 13, lineHeight: 19, marginBottom: 8, padding: 12 },
  loginRow: { color: CORES.cinzaTexto, fontSize: 13, marginTop: 20, textAlign: 'center' },
  loginLink: { color: CORES.azul, fontWeight: '800' },
  note: { color: CORES.cinzaTexto, fontSize: 11, marginTop: 12, textAlign: 'center' },
});
