import React from 'react';
import { StatusBar } from 'react-native';
import { registerRootComponent } from 'expo';
import AppNavigator from './src/AppNavigator'; // Ensure this path is correct

const App = () => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2e86de"
        translucent={false}
      />
      <AppNavigator />
    </>
  );
};

// This is only needed for Expo apps
registerRootComponent(App);

export default App;
