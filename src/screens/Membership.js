import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";

const MembershipManagementScreen = () => {
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [membershipStatus, setMembershipStatus] = useState("active");
  const [searchText, setSearchText] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  // Add Member
  const addMember = () => {
    const newMember = {
      id: Math.random().toString(),
      name: memberName,
      email: memberEmail,
      status: membershipStatus,
      membershipPlan: "Basic Plan", // Default plan
      purchaseHistory: [],
    };
    setMembers([...members, newMember]);
    setMemberName("");
    setMemberEmail("");
    setMembershipStatus("active");
    Alert.alert("Member Added", "The new member has been added.");
  };

  // Edit Member
  const editMember = (id) => {
    const member = members.find((mem) => mem.id === id);
    setMemberName(member.name);
    setMemberEmail(member.email);
    setMembershipStatus(member.status);
    setSelectedMember(member);
  };

  // Remove Member
  const removeMember = (id) => {
    setMembers(members.filter((mem) => mem.id !== id));
    Alert.alert("Member Removed", "The member has been removed.");
  };

  // Extend/Upgrade Membership
  const extendUpgradeMembership = (id) => {
    const updatedMembers = members.map((member) => {
      if (member.id === id) {
        member.membershipPlan = "Premium Plan"; // Example upgrade
        member.status = "active"; // Reset status to active after upgrade
      }
      return member;
    });
    setMembers(updatedMembers);
    Alert.alert("Membership Upgraded", "The member's membership has been upgraded.");
  };

  // Generate Receipt
  const generateReceipt = (id) => {
    const member = members.find((mem) => mem.id === id);
    Alert.alert("Receipt Generated", `Receipt for ${member.name} has been generated and sent.`);
  };

  // Filter Members
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchText.toLowerCase()) ||
    member.email.toLowerCase().includes(searchText.toLowerCase()) ||
    member.status.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Membership Management</Text>

      {/* Search Members */}
      <TextInput
        style={styles.input}
        placeholder="Search by Name, Email, or Status"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />

      {/* Member Details Input */}
      <TextInput
        style={styles.input}
        placeholder="Member Name"
        value={memberName}
        onChangeText={(text) => setMemberName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Member Email"
        value={memberEmail}
        onChangeText={(text) => setMemberEmail(text)}
      />

      {/* Add or Edit Member Button */}
      <Button title={selectedMember ? "Update Member" : "Add Member"} onPress={addMember} />

      {/* Member List */}
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.memberItem}>
            <Text style={styles.memberText}>Name: {item.name}</Text>
            <Text style={styles.memberText}>Email: {item.email}</Text>
            <Text style={styles.memberText}>Status: {item.status}</Text>
            <Text style={styles.memberText}>Membership Plan: {item.membershipPlan}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => editMember(item.id)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => extendUpgradeMembership(item.id)}>
                <Text style={styles.buttonText}>Extend/Upgrade</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => generateReceipt(item.id)}>
                <Text style={styles.buttonText}>Generate Receipt</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => removeMember(item.id)}>
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
  memberItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  memberText: {
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

export default MembershipManagementScreen;
