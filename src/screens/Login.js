import React, { useState } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { login } from "../api/api";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const userData = { email, password };
      const response = await login(userData);
      Alert.alert("Success", "Login Successful!");
      console.log("User Data:", response);
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Login Failed", error.message || "Invalid credentials.");
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput label="Email" mode="outlined" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Password" mode="outlined" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
        Login
      </Button>

      <Button mode="text" onPress={() => navigation.navigate("SignUpScreen")}>
        Don't have an account? Sign Up
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { marginBottom: 10 },
  button: { marginTop: 10 },
});

export default LoginScreen;
