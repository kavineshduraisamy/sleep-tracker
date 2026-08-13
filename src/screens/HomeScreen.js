import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SleepContext } from '../context/SleepContext';
import { colors } from '../constants/colors';
import { getTodayStr, formatDate } from '../utils/dateUtils';
import { calculateCurrentStreak } from '../utils/streakUtils';
import { getWeeklySleepData, formatDuration } from '../utils/sleepUtils';

import SleepGoalCard from '../components/SleepGoalCard';
import StreakCard from '../components/StreakCard';
import PrimaryButton from '../components/PrimaryButton';

const HomeScreen = ({ navigation }) => {
  const { records, settings, loading } = useContext(SleepContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Find today's record if it exists
  const todayStr = getTodayStr();
  const todayRecord = records.find(r => r.date === todayStr);
  
  // Or the most recent record
  const latestRecord = [...records].sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const currentStreak = calculateCurrentStreak(records);
  const weeklyData = getWeeklySleepData(records);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>{getGreeting()} 👋</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Last Night's Sleep</Text>
        {latestRecord ? (
          <>
            <Text style={styles.summaryDuration}>{formatDuration(latestRecord.durationMinutes)}</Text>
            <Text style={styles.summaryTime}>{latestRecord.bedtime} → {latestRecord.wakeTime}</Text>
          </>
        ) : (
          <Text style={styles.noDataText}>No recent sleep data. Ready to track?</Text>
        )}
      </View>

      <SleepGoalCard 
        currentMinutes={todayRecord ? todayRecord.durationMinutes : 0} 
        goalMinutes={settings.sleepGoalMinutes} 
      />

      <StreakCard currentStreak={currentStreak} />

      {weeklyData.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weeklyList}>
            {weeklyData.map(record => (
              <View key={record.id} style={styles.weeklyItem}>
                <Text style={styles.weeklyDay}>{formatDate(record.date, 'EEE')}</Text>
                <Text style={styles.weeklyDuration}>{formatDuration(record.durationMinutes)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <PrimaryButton 
          title="Log Sleep" 
          onPress={() => navigation.navigate('LogSleep')} 
          style={styles.actionBtn}
        />
        <TouchableOpacity 
          style={styles.secondaryBtn} 
          onPress={() => navigation.navigate('Calendar')}
        >
          <Text style={styles.secondaryBtnText}>View Calendar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  headerBtn: {
    marginRight: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  summaryDuration: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.surface,
    marginBottom: 4,
  },
  summaryTime: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  noDataText: {
    fontSize: 16,
    color: colors.surface,
    marginTop: 8,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  weeklyList: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  weeklyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  weeklyDay: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  weeklyDuration: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  actions: {
    marginTop: 32,
  },
  actionBtn: {
    marginBottom: 16,
  },
  secondaryBtn: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  }
});

export default HomeScreen;
