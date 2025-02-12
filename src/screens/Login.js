import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { id: 'admin', title: 'Admin', icon: 'admin-panel-settings' },
    { id: 'trainer', title: 'Trainer', icon: 'fitness-center' },
    { id: 'member', title: 'Member', icon: 'person' },
  ];

  const handleLogin = () => {
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }
    if (!email.trim() || !password.trim()) {
      alert('Please enter both email and password');
      return;
    }
    // Add your authentication logic here
    
    // For now, we'll just navigate to the main app
    navigation.navigate('MainApp', { role: selectedRole });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>GymPro</Text>
        </View>

        <View style={styles.roleContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleButton,
                selectedRole === role.id && styles.selectedRole,
              ]}
              onPress={() => setSelectedRole(role.id)}
            >
              <Icon 
                name={role.icon} 
                size={24} 
                color={selectedRole === role.id ? '#fff' : '#1a73e8'} 
              />
              <Text 
                style={[
                  styles.roleText,
                  selectedRole === role.id && styles.selectedRoleText,
                ]}
              >
                {role.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordIcon}
            >
              <Icon 
                name={showPassword ? 'visibility-off' : 'visibility'} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  roleButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a73e8',
    width: '30%',
  },
  selectedRole: {
    backgroundColor: '#1a73e8',
  },
  roleText: {
    marginTop: 5,
    color: '#1a73e8',
    fontSize: 14,
  },
  selectedRoleText: {
    color: '#fff',
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordIcon: {
    padding: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#1a73e8',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#1a73e8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;