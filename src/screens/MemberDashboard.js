import React from 'react';
import HomeScreen from './HomeScreen';
import { View } from 'react-native';

const MemberDashboard = ({ route, navigation }) => {
  const theme = {
    primary: '#7c3aed',
    secondary: '#6d28d9',
    accent: '#8b5cf6',
    background: '#f5f3ff',
    card: '#ffffff',
    text: '#4c1d95',
    gradient: ['#7c3aed', '#6d28d9'],
  };

  return (
    <View style={{ flex: 1 }}>
      <HomeScreen route={{ ...route, params: { role: 'member' } }} navigation={navigation} />
    </View>
  );
};

export default MemberDashboard;