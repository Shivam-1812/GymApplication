import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { auth, db } from "../config/firebaseConfig";

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const LoginSignUpScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = ['Member', 'Trainer', 'Admin'];

  // Add cleanup effect
  useEffect(() => {
    return () => {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSelectedRole('');
      setIsLoading(false);
    };
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Success', 
        'Password reset email sent. Please check your inbox.'
      );
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    // Validation
    if (!email || !password || (!isLogin && !confirmPassword)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (!isLogin && !selectedRole) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (!userDoc.exists()) {
          throw new Error('User profile not found. Please contact support.');
        }

        const userData = userDoc.data();
        if (!userData.role) {
          throw new Error('User role not found. Please contact support.');
        }

        // Update last login time
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          ...userData,
          lastLogin: new Date().toISOString()
        }, { merge: true });

        navigation.replace('MainApp', {
          role: userData.role,
          userId: userCredential.user.uid
        });
      } else {
        // Handle Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Store additional user data in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          role: selectedRole,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          name: '',
          phoneNumber: '',
          profileComplete: false
        });

        Alert.alert(
          'Success', 
          'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsLogin(true);
                setPassword('');
                setConfirmPassword('');
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Authentication error:', error);
      let errorMessage = 'An error occurred';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password must be at least 6 characters';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid password';
          break;
        default:
          errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>GymPro</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
          
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />
          )}

          <Text style={styles.roleLabel}>Select Role:</Text>
          <View style={styles.roleContainer}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleButton,
                  selectedRole === role && styles.roleButtonSelected,
                ]}
                onPress={() => setSelectedRole(role)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === role && styles.roleButtonTextSelected,
                  ]}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.actionButton, isLoading && styles.actionButtonDisabled]} 
            onPress={handleAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.actionButtonText}>
                {isLogin ? 'Login' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          {isLogin && (
            <TouchableOpacity 
              onPress={resetPassword}
              disabled={isLoading}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={() => {
              setIsLogin(!isLogin);
              setPassword('');
              setConfirmPassword('');
              setSelectedRole('');
            }}
            disabled={isLoading}
          >
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e86de',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  roleLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#2e86de',
    borderColor: '#2e86de',
  },
  roleButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  roleButtonTextSelected: {
    color: '#fff',
  },
  actionButton: {
    backgroundColor: '#2e86de',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#93c2ed',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    marginTop: 20,
    color: '#2e86de',
    textAlign: 'center',
    fontWeight: '500',
  },
  forgotPassword: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#2e86de',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginSignUpScreen;