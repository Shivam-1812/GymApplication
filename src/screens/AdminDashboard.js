import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

const DashboardScreen = () => {
  // Mock Data
  const [dashboardData, setDashboardData] = useState({
    totalMembers: 150,
    totalRevenue: 50000,
    totalEmployees: 12,
    attendance: {
      present: 120,
      absent: 20,
      late: 10,
    },
    expiringMemberships: [
      { name: "John Doe", daysLeft: 5 },
      { name: "Jane Smith", daysLeft: 3 },
    ],
    pendingTasks: [
      "Approve new member applications",
      "Follow up on pending payments",
      "Schedule equipment maintenance",
    ],
    revenueTrends: [10000, 12000, 15000, 13000, 17000], // Monthly revenue
    attendanceTrends: [110, 130, 120, 140, 150], // Weekly attendance
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Admin Dashboard</Text>

      {/* Summary Section */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Total Members</Text>
          <Text style={styles.summaryValue}>{dashboardData.totalMembers}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Total Revenue</Text>
          <Text style={styles.summaryValue}>${dashboardData.totalRevenue}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Total Employees</Text>
          <Text style={styles.summaryValue}>{dashboardData.totalEmployees}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Attendance Insights</Text>
          <Text style={styles.summaryValue}>
            Present: {dashboardData.attendance.present}, Absent:{" "}
            {dashboardData.attendance.absent}, Late:{" "}
            {dashboardData.attendance.late}
          </Text>
        </View>
      </View>

      {/* Expiring Memberships */}
      <Text style={styles.sectionTitle}>Expiring Memberships</Text>
      {dashboardData.expiringMemberships.map((member, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listText}>
            {member.name} - {member.daysLeft} days left
          </Text>
        </View>
      ))}

      {/* Pending Tasks */}
      <Text style={styles.sectionTitle}>Pending Tasks</Text>
      {dashboardData.pendingTasks.map((task, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listText}>{task}</Text>
        </View>
      ))}

      {/* Revenue Trends Chart */}
      <Text style={styles.sectionTitle}>Revenue Trends</Text>
      <LineChart
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
          datasets: [{ data: dashboardData.revenueTrends }],
        }}
        width={350}
        height={220}
        yAxisLabel="$"
        chartConfig={chartConfig}
        style={styles.chart}
      />

      {/* Attendance Trends Chart */}
      <Text style={styles.sectionTitle}>Attendance Trends</Text>
      <BarChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          datasets: [{ data: dashboardData.attendanceTrends }],
        }}
        width={350}
        height={220}
        yAxisLabel=""
        chartConfig={chartConfig}
        style={styles.chart}
      />
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#fb8c00",
  backgroundGradientTo: "#ffa726",
  decimalPlaces: 0, // No decimal places
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2e86de",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryBox: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e86de",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  listText: {
    fontSize: 16,
    color: "#555",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default DashboardScreen;
