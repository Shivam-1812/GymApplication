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
import ClassBooking from './screens/ClassBooking';
import FitnessTracking from './screens/FitnessTracking';
import MembershipManagement from './screens/MembershipManagement';

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
            iconName = 'people';
            break;
          case 'Reports':
            iconName = 'bar-chart';
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
          case 'Membership':
            iconName = 'card-membership';
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
      headerStyle: {
        backgroundColor: '#1a73e8',
      },
      headerTintColor: '#fff',
    })}
  >
    <Tab.Screen name="Dashboard" component={MemberDashboard} />
    <Tab.Screen 
      name="Workouts" 
      component={ClassBooking}
      options={{
        title: 'Class Bookings'
      }}
    />
    <Tab.Screen 
      name="Membership" 
      component={MembershipManagement}
      options={{
        title: 'Memberships'
      }}
    />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const DrawerNavigator = ({ route }) => {
  const { role } = route.params || {};
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} role={role} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a73e8',
        },
        headerTintColor: '#fff',
        drawerStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      {role === 'admin' ? (
        <Drawer.Screen 
          name="Admin" 
          component={AdminTabs}
          options={{
            title: 'Admin Dashboard'
          }}
        />
      ) : role === 'trainer' ? (
        <Drawer.Screen 
          name="Trainer" 
          component={TrainerTabs}
          options={{
            title: 'Trainer Dashboard'
          }}
        />
      ) : (
        <Drawer.Screen 
          name="Member" 
          component={MemberTabs}
          options={{
            title: 'Member Dashboard'
          }}
        />
      )}
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainApp" component={DrawerNavigator} />
      <Stack.Screen name="FitnessTracking" component={FitnessTracking} />
      <Stack.Screen name="MembershipManagement" component={MembershipManagement} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 16,
    backgroundColor: '#1a73e8',
  },
  drawerHeaderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
});

export default AppNavigator;