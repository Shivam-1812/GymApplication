import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";

const AttendanceComponent = () => {
  const [attendance, setAttendance] = useState([]); // Initialize attendance as an empty array
  const [name, setName] = useState(""); // State for name input
  const [status, setStatus] = useState(""); // State for status input

  // Function to handle marking attendance
  const handleMarkAttendance = (name, status) => {
    // Validate input
    if (!name || !status) {
      console.error("Name and status are required to mark attendance.");
      alert("Please provide both name and status.");
      return;
    }

    // Create a new attendance record
    const newRecord = {
      id: Date.now(), // Unique ID
      name,
      date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
      status,
    };

    // Update attendance state
    setAttendance((prev) => [...prev, newRecord]);

    // Clear input fields after submission
    setName("");
    setStatus("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Management</Text>

      {/* Input fields for name and status */}
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Status (Present/Absent/Late)"
        value={status}
        onChangeText={setStatus}
      />

      {/* Button to mark attendance */}
      <Button
        title="Mark Attendance"
        onPress={() => handleMarkAttendance(name, status)}
      />

      {/* Display attendance records */}
      <Text style={styles.subtitle}>Attendance Records:</Text>
      <FlatList
        data={attendance}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.record}>
            <Text style={styles.recordText}>
              {item.name} - {item.status} - {item.date}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No records found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e86de",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  record: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  recordText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 20,
  },
});

export default AttendanceComponent;
