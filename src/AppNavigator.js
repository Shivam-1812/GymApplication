import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUpScreen';
import SettingsScreen from './screens/Setting';
import ProfileScreen from './screens/Profile';
import AdminDashboard from './screens/AdminDashboard';
import TrainerDashboard from './screens/TrainerDashboard';
import MemberDashboard from './screens/MemberDashboard';
import ClassBooking from './screens/ClassBooking';
import FitnessTracking from './screens/FitnessTracking';
import MembershipManagement from './screens/MembershipManagement';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

/** ✅ Custom Drawer Content */
const CustomDrawerContent = (props) => {
  const { role } = props;
  
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>GymPro</Text>
        <Text style={styles.roleText}>{role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Member'}</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        icon={({ color, size }) => <Icon name="logout" size={size} color={color} />}
        onPress={async () => {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('userRole');
          props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }}
      />
    </DrawerContentScrollView>
  );
};

/** ✅ Bottom Tabs for Admin */
const AdminTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Dashboard" component={AdminDashboard} />
    <Tab.Screen name="Members" component={AdminDashboard} />
    <Tab.Screen name="Reports" component={AdminDashboard} />
  </Tab.Navigator>
);

/** ✅ Bottom Tabs for Trainer */
const TrainerTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Dashboard" component={TrainerDashboard} />
    <Tab.Screen name="Schedule" component={TrainerDashboard} />
    <Tab.Screen name="Clients" component={TrainerDashboard} />
  </Tab.Navigator>
);

/** ✅ Bottom Tabs for Member */
const MemberTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Dashboard" component={MemberDashboard} />
    <Tab.Screen name="Workouts" component={ClassBooking} options={{ title: 'Class Bookings' }} />
    <Tab.Screen name="Membership" component={MembershipManagement} options={{ title: 'Memberships' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

/** ✅ Drawer Navigation Based on Role */
const DrawerNavigator = ({ route }) => {
  const { role } = route.params || {};

  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} role={role} />}>
      {role === 'admin' ? (
        <Drawer.Screen name="Admin" component={AdminTabs} options={{ title: 'Admin Dashboard' }} />
      ) : role === 'trainer' ? (
        <Drawer.Screen name="Trainer" component={TrainerTabs} options={{ title: 'Trainer Dashboard' }} />
      ) : (
        <Drawer.Screen name="Member" component={MemberTabs} options={{ title: 'Member Dashboard' }} />
      )}
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

/** ✅ App Navigation with Authentication Check */
const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const role = await AsyncStorage.getItem('userRole');

        if (token && role) {
          setInitialRoute('MainApp');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="MainApp" component={DrawerNavigator} />
        <Stack.Screen name="FitnessTracking" component={FitnessTracking} />
        <Stack.Screen name="MembershipManagement" component={MembershipManagement} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

/** ✅ Styles */
const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#1a73e8',
    alignItems: 'center',
  },
  drawerHeaderText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  roleText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
