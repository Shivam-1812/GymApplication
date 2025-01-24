import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get("window");

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { role = "Member" } = route.params || {};

  const renderAdminDashboard = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Overview</Text>
        <View style={styles.statsContainer}>
          {[
            { number: 150, label: "Active Members" },
            { number: "₹2,00,000", label: "Monthly Revenue" },
            { number: 25, label: "Total Staff" },
            { number: 12, label: "New Joiners" },
          ].map((stat, index) => (
            <View key={index} style={styles.statBox}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          {[
            "Add Member",
            "Manage Staff",
            "View Reports",
            "Financial Summary",
          ].map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionButton}>
              <Text style={styles.actionText}>{action}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  const renderTrainerDashboard = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <View style={styles.scheduleContainer}>
          {[
            { time: "07:00 AM", client: "John Doe", type: "Personal Training" },
            { time: "09:00 AM", client: "Jane Smith", type: "Group Class" },
            { time: "11:00 AM", client: "Mike Johnson", type: "Assessment" },
          ].map((session, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text style={styles.scheduleTime}>{session.time}</Text>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleClient}>{session.client}</Text>
                <Text style={styles.scheduleType}>{session.type}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Overview</Text>
        <View style={styles.statsContainer}>
          {[
            { number: 15, label: "Active Clients" },
            { number: 8, label: "Sessions Today" },
            { number: 4, label: "New Assessments" },
          ].map((stat, index) => (
            <View key={index} style={styles.statBox}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  const renderMemberDashboard = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Fitness Journey</Text>
        <View style={styles.statsContainer}>
          {[
            { number: 25, label: "Sessions Completed" },
            { number: "15 kg", label: "Weight Lost" },
            { number: "30 days", label: "Membership Left" },
          ].map((stat, index) => (
            <View key={index} style={styles.statBox}>
              <Text style={styles.statNumber}>{stat.number}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          {[
            "Book Session",
            "View Progress",
            "Diet Plan",
            "Contact Trainer",
          ].map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionButton}>
              <Text style={styles.actionText}>{action}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
          <Image
            source={{ uri: "https://img.icons8.com/ios-filled/50/000000/menu--v1.png" }}
            style={styles.menuIcon}
          />
        </TouchableOpacity>
        <Text style={styles.logo}>GymPro</Text>
      </View>

      {/* Welcome Banner */}
      <View style={styles.banner}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.roleText}>{role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</Text>
      </View>

      {/* Role-based Dashboard */}
      <ScrollView style={styles.container}>
  {(() => {
    switch(role.toLowerCase()) {
      case "admin":
        return renderAdminDashboard();
      case "trainer":
        return renderTrainerDashboard();
      default:
        return renderMemberDashboard();
    }
  })()}
</ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Need help? Contact support</Text>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 4,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#1a73e8",
  },
  banner: {
    padding: 20,
    backgroundColor: "#1a73e8",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  roleText: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  section: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 16,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#202124",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statBox: {
    width: (width - 64) / 2 - 8,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a73e8",
  },
  statLabel: {
    fontSize: 14,
    color: "#5f6368",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionButton: {
    width: (width - 64) / 2 - 8,
    padding: 16,
    backgroundColor: "#1a73e8",
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "500",
  },
  scheduleContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 8,
  },
  scheduleItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e3e6",
  },
  scheduleTime: {
    width: 80,
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a73e8",
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleClient: {
    fontSize: 16,
    fontWeight: "500",
    color: "#202124",
  },
  scheduleType: {
    fontSize: 14,
    color: "#5f6368",
  },
  sidebar: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  sidebarHeader: {
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e3e6",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  sidebarLogo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a73e8",
    marginBottom: 4,
  },
  sidebarItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e3e6",
  },
  sidebarText: {
    fontSize: 16,
    color: "#202124",
  },
  footer: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: "#5f6368",
  },
});

export default HomeScreen;