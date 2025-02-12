// src/screens/MemberDashboard.js
import React from 'react';
import HomeScreen from './HomeScreen';

const MemberDashboard = ({ route, navigation }) => {
  return <HomeScreen route={{ ...route, params: { role: 'member' } }} navigation={navigation} />;
};

export default MemberDashboard;