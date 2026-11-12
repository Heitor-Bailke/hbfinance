import 'react-native-gesture-handler';
import React from 'react';
import * as Notifications from 'expo-notifications';
import { FinanceProvider } from './src/context/FinanceContext';
import Navigation from './src/navigation';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const App = () => (
  <FinanceProvider>
    <Navigation />
  </FinanceProvider>
);

export default App;
