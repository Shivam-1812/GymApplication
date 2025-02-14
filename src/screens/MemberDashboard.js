import React from 'react';
import HomeScreen from './HomeScreen';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('FitnessTracking')}
        >
          <Icon name="track-changes" size={24} color="#fff" />
          <Text style={styles.buttonText}>Fitness Tracking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 16,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MemberDashboard;