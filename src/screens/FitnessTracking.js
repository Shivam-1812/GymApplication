import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const FitnessTracking = ({ navigation }) => {
  // State for form inputs
  const [workout, setWorkout] = useState('');
  const [duration, setDuration] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  // State for tracking history and progress
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [bodyMetrics, setBodyMetrics] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  // Predefined workout templates
  const workoutTemplates = [
    { name: 'Upper Body', exercises: ['Bench Press', 'Shoulder Press', 'Pull-ups'] },
    { name: 'Lower Body', exercises: ['Squats', 'Deadlifts', 'Lunges'] },
    { name: 'Core', exercises: ['Planks', 'Crunches', 'Russian Twists'] },
    { name: 'Cardio', exercises: ['Treadmill', 'Cycling', 'Jump Rope'] }
  ];

  useEffect(() => {
    loadData();
  }, []);

  // Load saved data from AsyncStorage
  const loadData = async () => {
    try {
      const savedWorkouts = await AsyncStorage.getItem('workoutHistory');
      const savedMetrics = await AsyncStorage.getItem('bodyMetrics');
      
      if (savedWorkouts) setWorkoutHistory(JSON.parse(savedWorkouts));
      if (savedMetrics) setBodyMetrics(JSON.parse(savedMetrics));
    } catch (error) {
      Alert.alert('Error', 'Failed to load saved data');
    }
  };

  // Save workout to history
  const handleLogWorkout = async () => {
    if (!workout.trim() || !duration.trim()) {
      Alert.alert('Error', 'Please fill in all workout fields');
      return;
    }

    const newWorkout = {
      id: Date.now().toString(),
      type: workout,
      duration: parseInt(duration),
      sets: sets ? parseInt(sets) : 0,
      reps: reps ? parseInt(reps) : 0,
      date: new Date().toISOString(),
    };

    try {
      const updatedHistory = [newWorkout, ...workoutHistory];
      await AsyncStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
      setWorkoutHistory(updatedHistory);
      
      Alert.alert('Success', 'Workout logged successfully');
      resetWorkoutForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to save workout');
    }
  };

  // Save body metrics
  const handleLogBodyInfo = async () => {
    if (!weight.trim()) {
      Alert.alert('Error', 'Please enter at least your weight');
      return;
    }

    const newMetrics = {
      id: Date.now().toString(),
      weight: parseFloat(weight),
      bodyFat: bodyFat ? parseFloat(bodyFat) : null,
      date: new Date().toISOString(),
    };

    try {
      const updatedMetrics = [newMetrics, ...bodyMetrics];
      await AsyncStorage.setItem('bodyMetrics', JSON.stringify(updatedMetrics));
      setBodyMetrics(updatedMetrics);
      
      Alert.alert('Success', 'Body metrics logged successfully');
      resetBodyForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to save body metrics');
    }
  };

  const resetWorkoutForm = () => {
    setWorkout('');
    setDuration('');
    setSets('');
    setReps('');
  };

  const resetBodyForm = () => {
    setWeight('');
    setBodyFat('');
  };

  const renderWorkoutHistory = () => (
    <Modal
      visible={showHistory}
      animationType="slide"
      onRequestClose={() => setShowHistory(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Workout History</Text>
          <TouchableOpacity onPress={() => setShowHistory(false)}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={workoutHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyTitle}>{item.type}</Text>
              <Text>Duration: {item.duration} mins</Text>
              {item.sets > 0 && <Text>Sets: {item.sets}</Text>}
              {item.reps > 0 && <Text>Reps: {item.reps}</Text>}
              <Text>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );

  const renderBodyMetricsChart = () => (
    <Modal
      visible={showMetrics}
      animationType="slide"
      onRequestClose={() => setShowMetrics(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Body Metrics Progress</Text>
          <TouchableOpacity onPress={() => setShowMetrics(false)}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        {bodyMetrics.length > 0 && (
          <LineChart
            data={{
              labels: bodyMetrics.slice(-7).map(m => 
                new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              ),
              datasets: [{
                data: bodyMetrics.slice(-7).map(m => m.weight)
              }]
            }}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            style={styles.chart}
          />
        )}
        <FlatList
          data={bodyMetrics}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyTitle}>Weight: {item.weight} kg</Text>
              {item.bodyFat && <Text>Body Fat: {item.bodyFat}%</Text>}
              <Text>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Track Workouts</Text>
        <View style={styles.inputWrapper}>
          <Icon name="fitness-center" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Workout Type"
            value={workout}
            onChangeText={setWorkout}
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon name="timer" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Duration (minutes)"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon name="repeat" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Sets (optional)"
            value={sets}
            onChangeText={setSets}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon name="fitness-center" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Reps (optional)"
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.logButton} onPress={handleLogWorkout}>
          <Text style={styles.logButtonText}>Log Workout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Templates</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {workoutTemplates.map((template, index) => (
            <TouchableOpacity
              key={index}
              style={styles.templateCard}
              onPress={() => setWorkout(template.name)}
            >
              <Text style={styles.templateTitle}>{template.name}</Text>
              {template.exercises.map((exercise, i) => (
                <Text key={i} style={styles.templateExercise}>• {exercise}</Text>
              ))}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Metrics</Text>
        <View style={styles.inputWrapper}>
          <Icon name="monitor-weight" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Weight (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Icon name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Body Fat % (optional)"
            value={bodyFat}
            onChangeText={setBodyFat}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.logButton} onPress={handleLogBodyInfo}>
          <Text style={styles.logButtonText}>Log Body Info</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.historyButton]} 
          onPress={() => setShowHistory(true)}
        >
          <Icon name="history" size={20} color="#fff" />
          <Text style={styles.buttonText}>View History</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.metricsButton]} 
          onPress={() => setShowMetrics(true)}
        >
          <Icon name="show-chart" size={20} color="#fff" />
          <Text style={styles.buttonText}>View Progress</Text>
        </TouchableOpacity>
      </View>

      {renderWorkoutHistory()}
      {renderBodyMetricsChart()}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  logButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  logButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  historyButton: {
    backgroundColor: '#4caf50',
  },
  metricsButton: {
    backgroundColor: '#ff9800',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  historyItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  templateCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  templateExercise: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
  },
});

export default FitnessTracking;