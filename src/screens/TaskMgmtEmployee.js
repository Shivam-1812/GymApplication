import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";

const TaskManagementScreen = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete onboarding session",
      assignedTo: "Trainer A",
      status: "Pending",
      progress: 0,
    },
    {
      id: 2,
      title: "Answer support tickets",
      assignedTo: "Support Staff B",
      status: "Completed",
      progress: 100,
    },
  ]);
  
  const [newTask, setNewTask] = useState({
    title: "",
    assignedTo: "",
    status: "Pending",
    progress: 0,
  });

  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignedTo) {
      Alert.alert("Error", "Please provide task title and assignee.");
      return;
    }
    setTasks((prevTasks) => [
      ...prevTasks,
      { ...newTask, id: prevTasks.length + 1 },
    ]);
    setNewTask({ title: "", assignedTo: "", status: "Pending", progress: 0 });
  };

  const handleUpdateProgress = (id, progress) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, progress: progress } : task
      )
    );
  };

  const handleMarkComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: "Completed", progress: 100 } : task
      )
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskAssignedTo}>Assigned to: {item.assignedTo}</Text>
      <Text style={styles.taskStatus}>Status: {item.status}</Text>
      <Text style={styles.taskProgress}>Progress: {item.progress}%</Text>
      
      {item.status === "Pending" && (
        <View style={styles.actions}>
          <Button title="Mark as Complete" onPress={() => handleMarkComplete(item.id)} />
          <TextInput
            style={styles.progressInput}
            keyboardType="numeric"
            value={String(item.progress)}
            onChangeText={(text) => handleUpdateProgress(item.id, parseInt(text))}
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Management</Text>

      {/* Add New Task */}
      <View style={styles.newTaskContainer}>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={newTask.title}
          onChangeText={(text) => setNewTask({ ...newTask, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Assigned To"
          value={newTask.assignedTo}
          onChangeText={(text) => setNewTask({ ...newTask, assignedTo: text })}
        />
        <Button title="Add Task" onPress={handleAddTask} />
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  newTaskContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskAssignedTo: {
    fontSize: 16,
    marginTop: 5,
  },
  taskStatus: {
    fontSize: 16,
    marginTop: 5,
  },
  taskProgress: {
    fontSize: 16,
    marginTop: 5,
  },
  actions: {
    marginTop: 10,
  },
  progressInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginTop: 10,
    fontSize: 16,
  },
});

export default TaskManagementScreen;
