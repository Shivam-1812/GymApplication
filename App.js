import React from "react";
import { StatusBar } from "react-native";
import { registerRootComponent } from "expo"; // Import registerRootComponent for root registration
import AppNavigator from "./src/AppNavigator"; // Ensure AppNavigator path is correct
import { auth } from './src/config/firebaseConfig';

const App = () => {
  return (
    <>
      {/* Status Bar Customization */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2e86de"
        translucent={false}
      />
      {/* App Navigator */}
      <AppNavigator />
    </>
  );
};

// Register the component as the app's root
registerRootComponent(App);

export default App;
