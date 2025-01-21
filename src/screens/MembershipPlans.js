import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";

const MembershipPlansScreen = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching data with static data
  const fetchPlans = async () => {
    // Static data for testing
    const response = [
      {
        id: 1,
        name: "Basic Plan",
        duration: "1 Month",
        price: 10,
        features: ["Access to basic content", "1 event per month"],
        discount: 0,
      },
      {
        id: 2,
        name: "Premium Plan",
        duration: "3 Months",
        price: 25,
        features: ["Access to all content", "Unlimited events", "Priority support"],
        discount: 10,
      },
    ];
    setPlans(response);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePurchase = (plan) => {
    alert(`You have selected the ${plan.name} plan. Proceed to payment.`);
    // Integrate payment gateway here (e.g., Stripe, PayPal)
  };

  const renderItem = ({ item }) => (
    <View style={styles.planItem}>
      <Text style={styles.planName}>{item.name}</Text>
      <Text style={styles.planDuration}>Duration: {item.duration}</Text>
      <Text style={styles.planPrice}>Price: ${item.price}</Text>
      <Text style={styles.planFeatures}>Features: {item.features.join(", ")}</Text>
      {item.discount > 0 && (
        <Text style={styles.planDiscount}>Discount: {item.discount}% off</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => handlePurchase(item)}>
        <Text style={styles.buttonText}>Purchase/Upgrade</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Membership Plans</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : plans.length === 0 ? (
        <Text>No membership plans available</Text>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
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
  },
  planItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  planName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  planDuration: {
    fontSize: 16,
    marginTop: 5,
  },
  planPrice: {
    fontSize: 16,
    marginTop: 5,
  },
  planFeatures: {
    fontSize: 14,
    marginTop: 5,
  },
  planDiscount: {
    fontSize: 14,
    color: "red",
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default MembershipPlansScreen;
