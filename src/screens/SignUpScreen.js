import React, { useState } from "react";
import { View, StyleSheet, Alert, KeyboardAvoidingView } from "react-native";
import { Text, TextInput, Button, RadioButton } from "react-native-paper";
import { register } from "../api/api";

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member"); // Default role
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const userData = { firstName, lastName, email, password, role };
      await register(userData);
      Alert.alert("Success", "Registration Successful! You can now log in.");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Registration Failed", error.message || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput label="First Name" mode="outlined" value={firstName} onChangeText={setFirstName} style={styles.input} />
      <TextInput label="Last Name" mode="outlined" value={lastName} onChangeText={setLastName} style={styles.input} />
      <TextInput label="Email" mode="outlined" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Password" mode="outlined" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <Text style={styles.label}>Select Role</Text>
      <RadioButton.Group onValueChange={setRole} value={role}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Member" value="member" />
          <RadioButton.Item label="Trainer" value="trainer" />
          <RadioButton.Item label="Admin" value="admin" />
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleRegister} loading={loading} style={styles.button}>
        Sign Up
      </Button>

      <Button mode="text" onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { marginBottom: 10 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  radioContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  button: { marginTop: 10 },
});

export default SignUpScreen;
