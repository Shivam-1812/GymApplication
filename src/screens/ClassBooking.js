import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

const ClassBooking = ({ theme = {
    primary: '#1a73e8',
    text: '#000000',
    background: '#ffffff',
    card: '#ffffff'
  } }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [availableClasses, setAvailableClasses] = useState([
    {
      id: 1,
      name: 'Yoga Flow',
      trainer: 'Sarah Johnson',
      time: '07:00 AM',
      date: '2025-02-14',
      duration: '60 min',
      spots: 8,
      totalSpots: 15,
      type: 'yoga',
    },
    {
      id: 2,
      name: 'HIIT Workout',
      trainer: 'Mike Roberts',
      time: '08:30 AM',
      date: '2025-02-14',
      duration: '45 min',
      spots: 5,
      totalSpots: 12,
      type: 'hiit',
    },
    {
      id: 3,
      name: 'Strength Training',
      trainer: 'David Chen',
      time: '10:00 AM',
      date: '2025-02-14',
      duration: '50 min',
      spots: 10,
      totalSpots: 10,
      type: 'strength',
    },
  ]);

  const getClassIcon = (type) => {
    switch (type) {
      case 'yoga':
        return 'self-improvement';
      case 'hiit':
        return 'whatshot';
      case 'strength':
        return 'fitness-center';
      default:
        return 'event';
    }
  };

  const handleBookClass = (classId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setAvailableClasses(classes =>
      classes.map(c => {
        if (c.id === classId && c.spots > 0) {
          return { ...c, spots: c.spots - 1 };
        }
        return c;
      })
    );

    Alert.alert(
      'Class Booked!',
      'Your class has been successfully reserved. We\'ll send you a reminder before the class.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.bookingButton, { backgroundColor: theme.primary }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
      >
        <Icon name="event-available" size={20} color="#fff" />
        <Text style={styles.bookingButtonText}>View Available Classes</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Available Classes</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.classesList}>
              {availableClasses.map((class_) => (
                <View
                  key={class_.id}
                  style={[styles.classCard, { backgroundColor: theme.background }]}
                >
                  <View style={styles.classHeader}>
                    <Icon name={getClassIcon(class_.type)} size={24} color={theme.primary} />
                    <Text style={[styles.className, { color: theme.text }]}>{class_.name}</Text>
                  </View>
                  
                  <View style={styles.classDetails}>
                    <View style={styles.detailItem}>
                      <Icon name="person" size={16} color={theme.text} />
                      <Text style={[styles.detailText, { color: theme.text }]}>{class_.trainer}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Icon name="access-time" size={16} color={theme.text} />
                      <Text style={[styles.detailText, { color: theme.text }]}>
                        {class_.time} ({class_.duration})
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Icon name="event" size={16} color={theme.text} />
                      <Text style={[styles.detailText, { color: theme.text }]}>{class_.date}</Text>
                    </View>
                  </View>

                  <View style={styles.bookingSection}>
                    <Text style={[styles.spotsText, { color: theme.text }]}>
                      {class_.spots} spots available
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.bookButton,
                        {
                          backgroundColor: class_.spots > 0 ? theme.primary : '#ccc',
                        },
                      ]}
                      onPress={() => handleBookClass(class_.id)}
                      disabled={class_.spots === 0}
                    >
                      <Text style={styles.bookButtonText}>
                        {class_.spots > 0 ? 'Reserve Spot' : 'Full'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  bookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  classesList: {
    marginBottom: 16,
  },
  classCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  classDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  bookingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  spotsText: {
    fontSize: 14,
  },
  bookButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ClassBooking;