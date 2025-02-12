// src/screens/TrainerDashboard.js
import React from 'react';
import HomeScreen from './HomeScreen';

const TrainerDashboard = ({ route, navigation }) => {
  return <HomeScreen route={{ ...route, params: { role: 'trainer' } }} navigation={navigation} />;
};

export default TrainerDashboard;