import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SleepContext } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';
import { calculateAverageSleep, formatDuration } from '../utils/sleepUtils';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';

import StatCard from '../components/StatCard';
import SleepChart from '../components/SleepChart';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';

const StatsScreen = ({ navigation }) => {
  const { records = [], settings } = useContext(SleepContext);
  const { colors } = useTheme();

  if (!records || records.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState 
          icon="bar-chart-2"
          title="No Sleep Stats Yet"
          message="Log a few nights of sleep to start seeing trends, averages, and your sleep quality breakdown."
          action={
            <PrimaryButton 
              title="Log Your First Night" 
              icon="plus-circle"
              onPress={() => navigation.navigate('LogSleep')} 
            />
          }
        />
      </View>
    );
  }

  const goalMinutes = settings?.sleepGoalMinutes || 480;
  const averageSleep = calculateAverageSleep(records);
  const currentStreak = calculateCurrentStreak(records);
  const longestStreak = calculateLongestStreak(records);
  
  // Get last 7 days for the chart
  const last7Days = [...records].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
  
  // Calculate completion percentage
  const achievedDays = records.filter(r => r.durationMinutes >= goalMinutes).length;
  const completionPercentage = Math.round((achievedDays / records.length) * 100);

  // Quality distribution
  const qualityCounts = {
    excellent: records.filter(r => r.quality === 'excellent').length,
    good: records.filter(r => r.quality === 'good').length,
    fair: records.filter(r => r.quality === 'fair').length,
    poor: records.filter(r => r.quality === 'poor').length,
  };

  const total = records.length;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.content} 
      showsVerticalScrollIndicator={false}
    >
      {/* Header Summary */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon name="activity" size={18} color={colors.primary} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance Overview</Text>
        </View>
        <Text style={[styles.totalTrackedBadge, { backgroundColor: colors.surfaceSubtle, color: colors.textSecondary }]}>
          {total} Nights Tracked
        </Text>
      </View>
      
      {/* 2x2 Stat Cards Grid */}
      <View style={styles.statsRow}>
        <StatCard 
          title="Average Sleep" 
          value={formatDuration(averageSleep)} 
          subtitle={`Goal: ${formatDuration(goalMinutes)}`}
          icon="clock" 
          color={colors.primary} 
          trend={{ positive: averageSleep >= goalMinutes, label: averageSleep >= goalMinutes ? 'Target Met' : 'Under' }}
        />
        <StatCard 
          title="Goal Achieved" 
          value={`${completionPercentage}%`} 
          subtitle={`${achievedDays} of ${total} nights`}
          icon="target" 
          color={colors.success} 
          trend={{ positive: completionPercentage >= 70, label: `${achievedDays} days` }}
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard 
          title="Current Streak" 
          value={`${currentStreak} Days`} 
          subtitle="Consistency pace"
          icon="zap" 
          color={colors.streak} 
        />
        <StatCard 
          title="Longest Streak" 
          value={`${longestStreak} Days`} 
          subtitle="Personal best"
          icon="award" 
          color="#8B5CF6" 
        />
      </View>

      {/* Sleep Duration Chart */}
      <View style={styles.chartSection}>
        <SleepChart data={last7Days} title="Recent Sleep Trends" />
      </View>

      {/* Quality Breakdown Card */}
      <View style={[styles.qualityCard, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.cardShadow }]}>
        <View style={styles.qualityHeader}>
          <View style={styles.qualityTitleRow}>
            <Icon name="smile" size={16} color={colors.primary} style={styles.qualityIcon} />
            <Text style={[styles.qualityTitle, { color: colors.text }]}>Quality Breakdown</Text>
          </View>
          <Text style={[styles.qualitySub, { color: colors.textSecondary }]}>Based on all records</Text>
        </View>

        <View style={styles.qualityBars}>
          {[
            { key: 'excellent', label: 'Excellent', icon: 'award', color: colors.sleepQuality.excellent },
            { key: 'good', label: 'Good', icon: 'smile', color: colors.sleepQuality.good },
            { key: 'fair', label: 'Fair', icon: 'meh', color: colors.sleepQuality.fair },
            { key: 'poor', label: 'Poor', icon: 'frown', color: colors.sleepQuality.poor },
          ].map(q => {
            const count = qualityCounts[q.key];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <View key={q.key} style={styles.qualityItem}>
                <View style={styles.qualityItemHeader}>
                  <View style={styles.qualityItemLeft}>
                    <Icon name={q.icon} size={14} color={q.color} style={styles.itemIcon} />
                    <Text style={[styles.qualityItemLabel, { color: colors.text }]}>{q.label}</Text>
                  </View>
                  <Text style={[styles.qualityItemCount, { color: colors.textSecondary }]}>{count} nights ({pct}%)</Text>
                </View>
                <View style={[styles.barBg, { backgroundColor: colors.surfaceSubtle }]}>
                  <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: q.color }]} />
                </View>
              </View>
            );
          })}
        </View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  totalTrackedBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -6,
    marginBottom: 4,
  },
  chartSection: {
    marginVertical: 10,
  },
  qualityCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 3,
  },
  qualityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  qualityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qualityIcon: {
    marginRight: 6,
  },
  qualityTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  qualitySub: {
    fontSize: 12,
    color: colors.textMuted,
  },
  qualityBars: {
    gap: 12,
  },
  qualityItem: {
    marginBottom: 4,
  },
  qualityItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  qualityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 6,
  },
  qualityItemLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  qualityItemCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  barBg: {
    height: 8,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  }
});

export default StatsScreen;
