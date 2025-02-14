import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MEMBERSHIP_PLANS = {
  BASIC: {
    name: 'Basic',
    price: 29.99,
    benefits: [
      'Basic gym access',
      'Limited hours (6AM-8PM)',
      'Access to basic equipment',
    ],
    color: '#808080',
  },
  PREMIUM: {
    name: 'Premium',
    price: 49.99,
    benefits: [
      'Unlimited gym access',
      '24/7 access',
      'Free fitness classes',
      'Personal trainer consultation (1/month)',
      'Access to premium equipment',
    ],
    color: '#1a73e8',
  },
  ELITE: {
    name: 'Elite',
    price: 89.99,
    benefits: [
      'Unlimited gym access',
      '24/7 access',
      'Unlimited fitness classes',
      'Weekly personal trainer sessions',
      'Access to all equipment',
      'Spa access',
      'Nutritional counseling',
    ],
    color: '#ffd700',
  },
};

const MembershipManagement = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [membershipData, setMembershipData] = useState({
    status: 'Active',
    type: 'PREMIUM',
    startDate: '',
    expiryDate: '',
    remainingDays: 0,
    paymentHistory: [],
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    loadMembershipData();
  }, []);

  const loadMembershipData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('membershipData');
      if (savedData) {
        setMembershipData(JSON.parse(savedData));
      } else {
        // Initialize with default data if none exists
        const defaultData = {
          status: 'Active',
          type: 'BASIC',
          startDate: new Date().toISOString(),
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          remainingDays: 365,
          paymentHistory: [],
        };
        await AsyncStorage.setItem('membershipData', JSON.stringify(defaultData));
        setMembershipData(defaultData);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load membership data');
    } finally {
      setLoading(false);
    }
  };

  const saveMembershipData = async (newData) => {
    try {
      await AsyncStorage.setItem('membershipData', JSON.stringify(newData));
      setMembershipData(newData);
    } catch (error) {
      Alert.alert('Error', 'Failed to save membership data');
    }
  };

  const calculateRemainingDays = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = Math.abs(expiry - today);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleRenewMembership = () => {
    Alert.alert(
      'Renew Membership',
      `Renew your ${MEMBERSHIP_PLANS[membershipData.type].name} membership for another year?\nPrice: $${MEMBERSHIP_PLANS[membershipData.type].price}/month`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Renew',
          onPress: async () => {
            setProcessingPayment(true);
            try {
              // Simulate payment processing
              await new Promise(resolve => setTimeout(resolve, 1500));

              const newExpiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();
              const newPayment = {
                date: new Date().toISOString(),
                amount: MEMBERSHIP_PLANS[membershipData.type].price * 12,
                type: 'Renewal',
              };

              const updatedData = {
                ...membershipData,
                expiryDate: newExpiryDate,
                remainingDays: 365,
                paymentHistory: [...membershipData.paymentHistory, newPayment],
              };

              await saveMembershipData(updatedData);
              Alert.alert('Success', 'Membership renewed successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to process renewal');
            } finally {
              setProcessingPayment(false);
            }
          },
        },
      ]
    );
  };

  const handleUpgrade = async (newType) => {
    if (newType === membershipData.type) {
      Alert.alert('Info', 'You are already on this plan');
      return;
    }

    setProcessingPayment(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newPayment = {
        date: new Date().toISOString(),
        amount: MEMBERSHIP_PLANS[newType].price - MEMBERSHIP_PLANS[membershipData.type].price,
        type: 'Upgrade',
      };

      const updatedData = {
        ...membershipData,
        type: newType,
        paymentHistory: [...membershipData.paymentHistory, newPayment],
      };

      await saveMembershipData(updatedData);
      Alert.alert('Success', `Membership upgraded to ${MEMBERSHIP_PLANS[newType].name}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to process upgrade');
    } finally {
      setProcessingPayment(false);
      setShowUpgradeModal(false);
    }
  };

  const renderUpgradeModal = () => (
    <Modal
      visible={showUpgradeModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowUpgradeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.modalTitle}>Choose Your Plan</Text>
            {Object.entries(MEMBERSHIP_PLANS).map(([key, plan]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.planOption,
                  { borderColor: plan.color },
                  membershipData.type === key && styles.currentPlan,
                ]}
                onPress={() => handleUpgrade(key)}
                disabled={processingPayment}
              >
                <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                <Text style={styles.planPrice}>${plan.price}/month</Text>
                {plan.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Icon name="check" size={16} color={plan.color} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowUpgradeModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.statusCard}>
        <Text style={[
          styles.membershipType,
          { color: MEMBERSHIP_PLANS[membershipData.type].color }
        ]}>
          {MEMBERSHIP_PLANS[membershipData.type].name}
        </Text>
        <View style={styles.statusRow}>
          <Icon name="star" size={24} color={MEMBERSHIP_PLANS[membershipData.type].color} />
          <Text style={styles.statusText}>Status: {membershipData.status}</Text>
        </View>
        <View style={styles.statusRow}>
          <Icon name="event" size={24} color={MEMBERSHIP_PLANS[membershipData.type].color} />
          <Text style={styles.statusText}>
            Expires: {new Date(membershipData.expiryDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Icon name="timer" size={24} color={MEMBERSHIP_PLANS[membershipData.type].color} />
          <Text style={styles.statusText}>
            {calculateRemainingDays(membershipData.expiryDate)} days remaining
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Benefits</Text>
        {MEMBERSHIP_PLANS[membershipData.type].benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Icon
              name="check-circle"
              size={20}
              color={MEMBERSHIP_PLANS[membershipData.type].color}
            />
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[styles.button, styles.renewButton]}
          onPress={handleRenewMembership}
          disabled={processingPayment}
        >
          {processingPayment ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="autorenew" size={24} color="#fff" />
              <Text style={styles.buttonText}>Renew Membership</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.upgradeButton]}
          onPress={() => setShowUpgradeModal(true)}
          disabled={processingPayment}
        >
          <Icon name="upgrade" size={24} color="#fff" />
          <Text style={styles.buttonText}>Upgrade Plan</Text>
        </TouchableOpacity>
      </View>

      {renderUpgradeModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  membershipType: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#555',
  },
  buttonSection: {
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  renewButton: {
    backgroundColor: '#1a73e8',
  },
  upgradeButton: {
    backgroundColor: '#34a853',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  planOption: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  currentPlan: {
    backgroundColor: '#f8f9fa',
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MembershipManagement;