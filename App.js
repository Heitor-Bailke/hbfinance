import 'react-native-gesture-handler';
import React from 'react';
import { FinanceProvider } from './src/context/FinanceContext';
import Navigation from './src/navigation';

const App = () => (
  <FinanceProvider>
    <Navigation />
  </FinanceProvider>
);

export default App;
