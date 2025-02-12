// src/screens/AdminDashboard.js
import React from 'react';
import HomeScreen from './HomeScreen';

const AdminDashboard = ({ route, navigation }) => {
  return <HomeScreen route={{ ...route, params: { role: 'admin' } }} navigation={navigation} />;
};

export default AdminDashboard;
