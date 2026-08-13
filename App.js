import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SleepProvider } from './src/context/SleepContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <SleepProvider>
        <AppNavigator />
      </SleepProvider>
    </SafeAreaProvider>
  );
};

export default App;
