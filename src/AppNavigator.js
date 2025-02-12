import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import LoginScreen from './screens/Login';

import SettingsScreen from './screens/Setting';
import ProfileScreen from './screens/Profile';
import AdminDashboard from './screens/AdminDashboard';
import TrainerDashboard from './screens/TrainerDashboard';
import MemberDashboard from './screens/MemberDashboard';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Custom Drawer Content Component
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
        onPress={() => props.navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })}
      />
    </DrawerContentScrollView>
  );
};

// Role-specific tab navigators
const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Dashboard':
            iconName = 'dashboard';
            break;
          case 'Members':
            iconName = 'group';
            break;
          case 'Reports':
            iconName = 'assessment';
            break;
          default:
            iconName = 'circle';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1a73e8',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={AdminDashboard} />
    <Tab.Screen name="Members" component={AdminDashboard} />
    <Tab.Screen name="Reports" component={AdminDashboard} />
  </Tab.Navigator>
);

const TrainerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Dashboard':
            iconName = 'dashboard';
            break;
          case 'Schedule':
            iconName = 'schedule';
            break;
          case 'Clients':
            iconName = 'group';
            break;
          default:
            iconName = 'circle';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1a73e8',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={TrainerDashboard} />
    <Tab.Screen name="Schedule" component={TrainerDashboard} />
    <Tab.Screen name="Clients" component={TrainerDashboard} />
  </Tab.Navigator>
);

const MemberTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Dashboard':
            iconName = 'dashboard';
            break;
          case 'Workouts':
            iconName = 'fitness-center';
            break;
          case 'Profile':
            iconName = 'person';
            break;
          default:
            iconName = 'circle';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1a73e8',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={MemberDashboard} />
    <Tab.Screen name="Workouts" component={MemberDashboard} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Main content with role-based tabs
const MainContent = ({ route }) => {
  const { role } = route.params || {};
  
  switch (role?.toLowerCase()) {
    case 'admin':
      return <AdminTabs />;
    case 'trainer':
      return <TrainerTabs />;
    default:
      return <MemberTabs />;
  }
};

// Drawer navigator for authenticated screens
const DrawerNavigator = ({ route }) => {
  const { role } = route.params || {};
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      drawerContent={(props) => <CustomDrawerContent {...props} role={role} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={MainContent}
        initialParams={{ role }}
        options={{ 
          title: 'GymPro',
          headerStyle: {
            backgroundColor: '#1a73e8',
          },
          headerTintColor: '#fff',
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerStyle: {
            backgroundColor: '#1a73e8',
          },
          headerTintColor: '#fff',
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          headerStyle: {
            backgroundColor: '#1a73e8',
          },
          headerTintColor: '#fff',
        }}
      />
    </Drawer.Navigator>
  );
};

// Main navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MainApp" 
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    backgroundColor: '#1a73e8',
  },
  drawerHeaderText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  roleText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
  },
});

export default AppNavigator;