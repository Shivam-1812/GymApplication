import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  RefreshControl,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get("window");

const themes = {
  admin: {
    primary: '#2563eb',
    secondary: '#1d4ed8',
    accent: '#3b82f6',
    background: '#eff6ff',
    card: '#ffffff',
    text: '#1e3a8a',
    gradient: ['#2563eb', '#1d4ed8'],
  },
  trainer: {
    primary: '#059669',
    secondary: '#047857',
    accent: '#10b981',
    background: '#ecfdf5',
    card: '#ffffff',
    text: '#064e3b',
    gradient: ['#059669', '#047857'],
  },
  member: {
    primary: '#7c3aed',
    secondary: '#6d28d9',
    accent: '#8b5cf6',
    background: '#f5f3ff',
    card: '#ffffff',
    text: '#4c1d95',
    gradient: ['#7c3aed', '#6d28d9'],
  },
};

const HomeScreen = ({ route, navigation }) => {
  const { role = "member" } = route.params || {};
  const theme = themes[role.toLowerCase()] || themes.member;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New workout plan available", time: "2m ago", type: "workout" },
    { id: 2, message: "Upcoming session in 1 hour", time: "15m ago", type: "session" },
    { id: 3, message: "Achievement unlocked: 10 sessions", time: "1h ago", type: "achievement" },
  ]);

  // New state for achievements and stats
  const [achievements, setAchievements] = useState([
    { id: 1, title: "10 Sessions Complete", progress: 80 },
    { id: 2, title: "Weight Goal Progress", progress: 60 },
    { id: 3, title: "Attendance Streak", progress: 45 },
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isExpanded, setIsExpanded] = useState(false);

  // Chart data based on selected period
  const chartData = {
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{ data: [65, 59, 80, 81, 56, 55, 70] }],
    },
    month: {
      labels: ["W1", "W2", "W3", "W4"],
      datasets: [{ data: [70, 75, 68, 82] }],
    },
    year: {
      labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
      datasets: [{ data: [60, 65, 70, 75, 78, 82] }],
    },
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const toggleNotifications = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowNotifications(!showNotifications);
  };

  const bellAnim = useRef(new Animated.Value(0)).current;
  const animateBell = () => {
    Animated.sequence([
      Animated.timing(bellAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bellAnim, {
        toValue: -1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bellAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'workout':
        return 'fitness-center';
      case 'session':
        return 'event';
      case 'achievement':
        return 'emoji-events';
      default:
        return 'notifications';
    }
  };

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          backgroundColor: theme.primary,
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        },
      ]}
    >
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => {
            toggleNotifications();
            animateBell();
          }}
        >
          <Animated.View style={{
            transform: [{
              rotate: bellAnim.interpolate({
                inputRange: [-1, 1],
                outputRange: ['-20deg', '20deg']
              })
            }]
          }}>
            <Icon name="notifications" size={24} color="#fff" />
          </Animated.View>
          {notifications.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{notifications.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.welcomeContent}>
        <Text style={styles.greetingText}>Welcome back</Text>
        <Text style={styles.nameText}>John Doe</Text>
        <View style={[styles.roleChip, { backgroundColor: theme.secondary }]}>
          <Icon name={role.toLowerCase() === 'admin' ? 'admin-panel-settings' : 'person'} size={16} color="#fff" style={styles.roleIcon} />
          <Text style={styles.roleText}>{role}</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderStatsSection = () => (
    <Animated.View 
      style={[
        styles.section,
        {
          backgroundColor: theme.card,
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        }
      ]}
    >
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Stats</Text>
      <View style={styles.statsGrid}>
        {getStatsForRole(role).map((stat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.statCard, { backgroundColor: theme.background }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Icon name={stat.icon} size={24} color={theme.primary} />
            <Text style={[styles.statValue, { color: theme.primary }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: theme.text }]}>{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderAchievements = () => (
    <Animated.View
      style={[
        styles.section,
        {
          backgroundColor: theme.card,
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        }
      ]}
    >
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
      {achievements.map((achievement) => (
        <View key={achievement.id} style={styles.achievementItem}>
          <View style={styles.achievementHeader}>
            <Text style={[styles.achievementTitle, { color: theme.text }]}>
              {achievement.title}
            </Text>
            <Text style={[styles.achievementProgress, { color: theme.primary }]}>
              {achievement.progress}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: theme.background }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.primary,
                  width: `${achievement.progress}%`,
                }
              ]}
            />
          </View>
        </View>
      ))}
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
          />
        }
      >
        {renderHeader()}

        {showNotifications && (
          <Animated.View 
            entering={Animated.FadeInDown}
            style={[styles.notificationsPanel, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.notificationsPanelTitle, { color: theme.text }]}>
              Notifications
            </Text>
            {notifications.map(notification => (
              <TouchableOpacity 
                key={notification.id} 
                style={styles.notificationItem}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Icon name={getNotificationIcon(notification.type)} size={20} color={theme.primary} />
                <View style={styles.notificationContent}>
                  <Text style={[styles.notificationMessage, { color: theme.text }]}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {renderStatsSection()}

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Progress</Text>
            <View style={styles.periodSelector}>
              {['week', 'month', 'year'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && { backgroundColor: theme.primary }
                  ]}
                  onPress={() => {
                    setSelectedPeriod(period);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period && { color: '#fff' }
                    ]}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <LineChart
            data={chartData[selectedPeriod]}
            width={width - 64}
            height={220}
            chartConfig={{
              backgroundColor: theme.card,
              backgroundGradientFrom: theme.card,
              backgroundGradientTo: theme.card,
              decimalPlaces: 0,
              color: (opacity = 1) => theme.primary,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {renderAchievements()}
      </ScrollView>

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          // Handle FAB press
        }}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const getStatsForRole = (role) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return [
        { icon: 'people', value: '150', label: 'Active Members' },
        { icon: 'attach-money', value: '₹2L', label: 'Revenue' },
        { icon: 'trending-up', value: '25%', label: 'Growth' },
        { icon: 'fitness-center', value: '48', label: 'Classes' },
      ];
    case 'trainer':
      return [
        { icon: 'people', value: '15', label: 'Active Clients' },
        { icon: 'event', value: '8', label: 'Sessions Today' },
        { icon: 'assessment', value: '4', label: 'Assessments' },
        { icon: 'star', value: '4.8', label: 'Rating' },
      ];
    default:
      return [
        { icon: 'fitness-center', value: '25', label: 'Sessions Done' },
        { icon: 'whatshot', value: '15kg', label: 'Weight Lost' },
        { icon: 'timeline', value: '30', label: 'Days Streak' },
        { icon: 'emoji-events', value: '5', label: 'Achievements' },
      ];
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  welcomeContent: {
    marginTop: 8,
  },
  greetingText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  roleIcon: {
    marginRight: 6,
  },
  roleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: 4,
    top: 4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationsPanel: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationsPanelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  notificationContent: {
    marginLeft: 12,
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statCard: {
    width: (width - 64 - 32) / 2,
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    padding: 4,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  achievementItem: {
    marginBottom: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  achievementProgress: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  }
});

export default HomeScreen;