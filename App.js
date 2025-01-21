import React from "react";
import { StatusBar } from "react-native";
import AppNavigator from "./src/AppNavigator"; // Import the corrected AppNavigator  

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

export default App;
