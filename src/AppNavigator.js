import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import LoginScreen from './screens/Login';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/Setting';
import ProfileScreen from './screens/Profile';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Role-specific tab navigators
const MemberTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Profile':
            iconName = 'person';
            break;
          case 'Workouts':
            iconName = 'fitness-center';
            break;
          default:
            iconName = 'circle';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Workouts" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const TrainerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = 'home';
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
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Schedule" component={HomeScreen} />
    <Tab.Screen name="Clients" component={HomeScreen} />
  </Tab.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = 'home';
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
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Members" component={HomeScreen} />
    <Tab.Screen name="Reports" component={HomeScreen} />
  </Tab.Navigator>
);

// Custom Drawer Content
const CustomDrawerContent = ({ navigation, role }) => {
  const getNavigationItems = (userRole) => {
    const commonItems = ["Home", "Profile", "Contact Us", "Logout", "Settings"];
    const roleSpecificItems = {
      admin: ["Membership Plans", "Employee Management", "Reports", "Financial Overview"],
      trainer: ["My Schedule", "Client Management", "Workout Plans", "Performance Tracking"],
      member: ["My Workouts", "Book Session", "Progress Tracker", "Membership Details"],
    };
    return [...commonItems, ...(roleSpecificItems[userRole.toLowerCase()] || [])];
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Image
          source={{ uri: "https://via.placeholder.com/50" }}
          style={styles.profileImage}
        />
        <Text style={styles.drawerLogo}>GymPro</Text>
        <Text style={styles.roleText}>{role?.toUpperCase()}</Text>
      </View>
      {getNavigationItems(role).map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.drawerItem}
          onPress={() => {
            switch (item) {
              case 'Logout':
                navigation.navigate('Login');
                break;
              case 'Settings':
                navigation.navigate('Settings');
                break;
              case 'Profile':
                navigation.navigate('Profile');
                break;
              case 'Home':
                navigation.navigate('MainTabs');
                break;
              default:
                console.log('Navigate to', item);
            }
          }}
        >
          <Text style={styles.drawerItemText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Main content with role-based tabs
const MainContent = ({ route }) => {
  const { role } = route.params || {};
  
  let TabNavigator;
  switch (role?.toLowerCase()) {
    case 'admin':
      TabNavigator = AdminTabs;
      break;
    case 'trainer':
      TabNavigator = TrainerTabs;
      break;
    default:
      TabNavigator = MemberTabs;
  }
  
  return <TabNavigator />;
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
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
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
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: '#1a73e8',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  drawerLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  roleText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e3e6',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#202124',
  },
});

export default AppNavigator;