import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const settingsItems = [
    {
      icon: 'notifications',
      title: 'Notifications',
      subtitle: 'Receive workout reminders and updates',
      toggle: {
        value: notificationsEnabled,
        onToggle: () => setNotificationsEnabled(!notificationsEnabled)
      }
    },
    {
      icon: 'moon',
      title: 'Dark Mode',
      subtitle: 'Switch between light and dark themes',
      toggle: {
        value: darkModeEnabled,
        onToggle: () => setDarkModeEnabled(!darkModeEnabled)
      }
    },
    {
      icon: 'fitness',
      title: 'Workout Goals',
      subtitle: 'Set and track your fitness objectives',
      navigateTo: 'WorkoutGoals'
    },
    {
      icon: 'person',
      title: 'Profile Settings',
      subtitle: 'Edit personal information',
      navigateTo: 'ProfileSettings'
    },
    {
      icon: 'lock-closed',
      title: 'Privacy & Security',
      subtitle: 'Manage account privacy',
      navigateTo: 'PrivacySettings'
    },
    {
      icon: 'sync',
      title: 'Data Sync',
      subtitle: 'Sync fitness data with health platforms',
      navigateTo: 'DataSync'
    }
  ];

  const renderSettingItem = (item) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={item.navigateTo ? () => {} : item.toggle?.onToggle}
    >
      <View style={styles.settingItemContent}>
        <Ionicons 
          name={item.icon} 
          size={24} 
          color="#007BFF" 
          style={styles.settingIcon} 
        />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
        {item.toggle && (
          <Switch
            value={item.toggle.value}
            onValueChange={item.toggle.onToggle}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={item.toggle.value ? "#f5dd4b" : "#f4f3f4"}
          />
        )}
        {item.navigateTo && (
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color="#C7C7CC" 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        {settingsItems.map((item, index) => (
          <View key={index}>
            {renderSettingItem(item)}
            {index < settingsItems.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    paddingBottom: 0,
    color: '#333',
  },
  settingItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
});

export default SettingsScreen;