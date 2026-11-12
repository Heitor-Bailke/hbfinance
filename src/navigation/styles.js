import { StyleSheet } from 'react-native';
import { CORES } from '../utils/formatacao';

export default StyleSheet.create({
  drawer: { flex: 1 },
  drawerHeader: { backgroundColor: CORES.marinho, padding: 24 },
  drawerLogo: { color: CORES.verde, fontSize: 28, fontWeight: '900' },
  drawerGreeting: { color: CORES.branco, fontSize: 17, fontWeight: '700', marginTop: 10 },
  drawerList: { flex: 1, paddingTop: 10 },
  logout: { borderTopColor: CORES.borda, borderTopWidth: 1, padding: 18 },
  logoutText: { color: CORES.vermelho, fontSize: 15, fontWeight: '700' },
  menuButton: { alignItems: 'center', justifyContent: 'center', minWidth: 52, paddingHorizontal: 14, paddingVertical: 8 },
  menuButtonText: { color: CORES.branco, fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  navigator: { drawerActiveTintColor: CORES.marinho, drawerInactiveTintColor: '#64748B', headerStyle: { backgroundColor: CORES.marinho }, headerTintColor: CORES.branco },
  drawerNotificationLabel: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  drawerNotificationText: { color: '#64748B', fontSize: 14, fontWeight: '600' },
  notificationDot: { backgroundColor: CORES.azul, borderRadius: 5, height: 10, width: 10 },
});
