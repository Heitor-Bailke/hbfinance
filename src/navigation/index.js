import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Cadastro from '../screens/Cadastro';
import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import Lancamentos from '../screens/Lancamentos';
import NovoLancamento from '../screens/NovoLancamento';
import Relatorios from '../screens/Relatorios';
import { useFinance } from '../context/FinanceContext';
import styles from './styles';

const Drawer = createDrawerNavigator();

const MenuDrawer = (props) => {
  const { usuario, sair } = useFinance();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerLogo}>HB</Text>
        <Text style={styles.drawerGreeting}>Olá, {usuario?.nome || 'usuário'}</Text>
      </View>
      <View style={styles.drawerList}><DrawerItemList {...props} /></View>
      <Pressable accessibilityRole="button" accessibilityLabel="Sair da conta" onPress={sair} style={styles.logout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
};

const NavegacaoPrincipal = () => (
  <Drawer.Navigator
    drawerContent={(props) => <MenuDrawer {...props} />}
    screenOptions={({ navigation }) => ({
      ...styles.navigator,
      headerLeft: () => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Abrir menu"
          onPress={() => navigation.toggleDrawer()}
          style={styles.menuButton}
        >
          <Text style={styles.menuButtonText}>•••</Text>
        </Pressable>
      ),
    })}
  >
    <Drawer.Screen name="Dashboard" component={Dashboard} />
    <Drawer.Screen name="Lançamentos" component={Lancamentos} />
    <Drawer.Screen name="NovoLancamento" component={NovoLancamento} options={{ title: 'Novo lançamento' }} />
    <Drawer.Screen name="Relatórios" component={Relatorios} />
  </Drawer.Navigator>
);

const Navigation = () => {
  const { usuario } = useFinance();
  const [modo, setModo] = React.useState('login');
  return <NavigationContainer>{usuario ? <NavegacaoPrincipal /> : modo === 'login' ? <Login onCriarConta={() => setModo('cadastro')} /> : <Cadastro onVoltarLogin={() => setModo('login')} />}</NavigationContainer>;
};

export default Navigation;
