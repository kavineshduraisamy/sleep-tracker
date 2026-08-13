import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SleepContext } from '../context/SleepContext';
import { colors } from '../constants/colors';
import { calculateAverageSleep, formatDuration } from '../utils/sleepUtils';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';

import StatCard from '../components/StatCard';
import SleepChart from '../components/SleepChart';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';

const StatsScreen = ({ navigation }) => {
  const { records, settings } = useContext(SleepContext);

  if (!records || records.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState 
          icon="pie-chart"
          title="Not enough data"
          message="Log a few nights of sleep to see your trends and statistics."
          action={
            <PrimaryButton 
              title="Log Sleep" 
              onPress={() => navigation.navigate('LogSleep')} 
            />
          }
        />
      </View>
    );
  }

  const averageSleep = calculateAverageSleep(records);
  const currentStreak = calculateCurrentStreak(records);
  const longestStreak = calculateLongestStreak(records);
  
  // Get last 7 days for the chart
  const last7Days = [...records].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
  
  // Calculate completion percentage
  const goalMinutes = settings.sleepGoalMinutes;
  const achievedDays = records.filter(r => r.durationMinutes >= goalMinutes).length;
  const completionPercentage = Math.round((achievedDays / records.length) * 100);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Overview</Text>
      
      <View style={styles.statsRow}>
        <StatCard 
          title="Average Sleep" 
          value={formatDuration(averageSleep)} 
          icon="clock" 
          color={colors.primary} 
        />
        <StatCard 
          title="Goal Completion" 
          value={`${completionPercentage}%`} 
          icon="target" 
          color={colors.success} 
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard 
          title="Current Streak" 
          value={`${currentStreak} days`} 
          icon="activity" 
          color={colors.streak} 
        />
        <StatCard 
          title="Longest Streak" 
          value={`${longestStreak} days`} 
          icon="award" 
          color={colors.streak} 
        />
      </View>

      <Text style={[styles.sectionTitle, styles.chartTitle]}>Last 7 Days</Text>
      <SleepChart data={last7Days} title="Sleep Duration (hrs)" />

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  chartTitle: {
    marginTop: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -6, // Compensate for card margins
    marginBottom: 4,
  }
});

export default StatsScreen;
