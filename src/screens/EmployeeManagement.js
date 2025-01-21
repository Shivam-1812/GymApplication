import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";

const EmployeeManagementScreen = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [searchText, setSearchText] = useState("");

  // Add Employee
  const addEmployee = () => {
    const newEmployee = {
      id: Math.random().toString(),
      name: employeeName,
      role: employeeRole,
      employeeId: employeeId,
      attendance: "Present", // Default attendance status
      payroll: 2000, // Default payroll
    };
    setEmployees([...employees, newEmployee]);
    setEmployeeName("");
    setEmployeeRole("");
    setEmployeeId("");
    Alert.alert("Employee Added", "The new employee has been added.");
  };

  // Edit Employee
  const editEmployee = (id) => {
    const employee = employees.find((emp) => emp.id === id);
    setEmployeeName(employee.name);
    setEmployeeRole(employee.role);
    setEmployeeId(employee.employeeId);
  };

  // Remove Employee
  const removeEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    Alert.alert("Employee Removed", "The employee has been removed.");
  };

  // Filter Employees
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchText.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle Payroll Generation
  const generatePayroll = (id) => {
    const employee = employees.find((emp) => emp.id === id);
    Alert.alert("Payroll Generated", `Employee ${employee.name} has a payroll of $${employee.payroll}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Management</Text>

      {/* Search Employees */}
      <TextInput
        style={styles.input}
        placeholder="Search by Name, Role, or ID"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      {/* Employee Details Input */}
      <TextInput
        style={styles.input}
        placeholder="Employee Name"
        value={employeeName}
        onChangeText={(text) => setEmployeeName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Employee Role"
        value={employeeRole}
        onChangeText={(text) => setEmployeeRole(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Employee ID"
        value={employeeId}
        onChangeText={(text) => setEmployeeId(text)}
      />

      {/* Add or Edit Employee Button */}
      <Button title="Add Employee" onPress={addEmployee} />

      {/* Employee List */}
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.employeeItem}>
            <Text style={styles.employeeText}>Name: {item.name}</Text>
            <Text style={styles.employeeText}>Role: {item.role}</Text>
            <Text style={styles.employeeText}>Employee ID: {item.employeeId}</Text>
            <Text style={styles.employeeText}>Attendance: {item.attendance}</Text>
            <Text style={styles.employeeText}>Payroll: ${item.payroll}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => editEmployee(item.id)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => generatePayroll(item.id)}>
                <Text style={styles.buttonText}>Generate Payroll</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => removeEmployee(item.id)}>
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  employeeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  employeeText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default EmployeeManagementScreen;
