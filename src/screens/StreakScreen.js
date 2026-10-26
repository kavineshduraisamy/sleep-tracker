import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SleepContext } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';
import { calculateAverageSleep, formatDuration } from '../utils/sleepUtils';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';
import { format, subDays } from 'date-fns';

import SleepChart from '../components/SleepChart';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';

const MILESTONES = [
  { days: 3, label: '3-Day Starter', icon: 'flash' },
  { days: 7, label: 'Week Warrior', icon: 'ribbon' },
  { days: 14, label: 'Habit Master', icon: 'shield-checkmark' },
  { days: 30, label: 'Sleep Champion', icon: 'trophy' },
];

const StreakScreen = ({ navigation }) => {
  const { records = [], settings } = useContext(SleepContext);
  const { colors, isDark } = useTheme();

  if (!records || records.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState 
          icon="flame"
          title="No Streak & Performance Data Yet"
          message="Log consecutive nights of sleep to start building your streak, track your performance trends, and unlock milestone badges."
          action={
            <PrimaryButton 
              title="Log Your First Night" 
              icon="plus"
              onPress={() => navigation.navigate('LogSleep')} 
            />
          }
        />
      </View>
    );
  }

  const goalMinutes = settings?.sleepGoalMinutes || 480;
  const currentStreak = calculateCurrentStreak(records);
  const longestStreak = calculateLongestStreak(records);
  const totalTracked = records.length;
  const averageSleep = calculateAverageSleep(records);

  // Get last 7 days for the chart
  const last7Days = [...records].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);

  // Goal achievement rate
  const achievedDays = records.filter(r => r.durationMinutes >= goalMinutes).length;
  const completionPercentage = totalTracked > 0 ? Math.round((achievedDays / totalTracked) * 100) : 0;

  // Quality distribution
  const qualityCounts = {
    excellent: records.filter(r => r.quality === 'excellent').length,
    good: records.filter(r => r.quality === 'good').length,
    fair: records.filter(r => r.quality === 'fair').length,
    poor: records.filter(r => r.quality === 'poor').length,
  };

  // Past 7 days status
  const today = new Date();
  const weekDays = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
  
  const getDayStatus = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return records.some(r => r.date === dateStr);
  };

  const getStreakTier = (streak) => {
    if (streak >= 30) return { label: 'Legendary Consistency', color: '#8B5CF6' };
    if (streak >= 14) return { label: 'Habit Master', color: '#10B981' };
    if (streak >= 7) return { label: 'Week Warrior', color: '#3B82F6' };
    if (streak >= 3) return { label: 'On a Roll!', color: colors.streak };
    if (streak >= 1) return { label: 'Great Start!', color: colors.primary };
    return { label: 'Start Tonight', color: colors.textSecondary };
  };

  const tier = getStreakTier(currentStreak);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.content} 
      showsVerticalScrollIndicator={false}
    >
      {/* ========================================================= */}
      {/* HERO STREAK CARD */}
      {/* ========================================================= */}
      <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: `${colors.streak}35` }]}>
        <View style={[styles.glowRingOuter, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : colors.streakSoft, borderColor: `${colors.streak}40` }]}>
          <View style={[styles.glowRingInner, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.25)' : colors.streakLight }]}>
            <Ionicons name="flame" size={42} color={colors.streak} />
          </View>
        </View>

        <Text style={[styles.heroValue, { color: colors.text }]}>{currentStreak}</Text>
        <Text style={[styles.heroLabel, { color: colors.streak }]}>DAY STREAK</Text>
        
        <View style={[styles.tierBadge, { backgroundColor: `${tier.color}15`, borderColor: `${tier.color}40` }]}>
          <Text style={[styles.tierText, { color: tier.color }]}>{tier.label}</Text>
        </View>

        <Text style={[styles.heroMessage, { color: colors.textSecondary }]}>
          {currentStreak === 0 
            ? 'Track consecutive nights to build momentum and unlock consistency milestones.' 
            : 'Sleep habits improve when kept regular. Keep up the great consistency!'}
        </Text>
      </View>

      {/* ========================================================= */}
      {/* PERFORMANCE OVERVIEW (MERGED FROM TRENDS) */}
      {/* ========================================================= */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="trending-up" size={18} color={colors.primary} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Performance Overview</Text>
        </View>
        <Text style={[styles.totalTrackedBadge, { backgroundColor: colors.primarySoft, color: colors.primary }]}>
          {totalTracked} Nights Tracked
        </Text>
      </View>

      {/* 2x2 Metric Cards Grid */}
      <View style={styles.metricsGrid}>
        {/* Row 1 */}
        <View style={styles.metricsRow}>
          {/* Current Streak */}
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={styles.metricCardHeader}>
              <View style={[styles.metricIconBox, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : colors.streakSoft }]}>
                <Ionicons name="flame" size={18} color={colors.streak} />
              </View>
              <View style={[styles.pillTag, { backgroundColor: colors.streakSoft }]}>
                <Text style={[styles.pillTagText, { color: colors.streak }]}>Active</Text>
              </View>
            </View>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Current Streak</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{currentStreak} Days</Text>
            <Text style={[styles.metricSub, { color: colors.textMuted }]}>Consistency pace</Text>
          </View>

          {/* Longest Streak */}
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={styles.metricCardHeader}>
              <View style={[styles.metricIconBox, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : '#EDE9FE' }]}>
                <Ionicons name="trophy" size={18} color="#8B5CF6" />
              </View>
              <View style={[styles.pillTag, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF' }]}>
                <Text style={[styles.pillTagText, { color: '#8B5CF6' }]}>Best</Text>
              </View>
            </View>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Longest Streak</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{longestStreak} Days</Text>
            <Text style={[styles.metricSub, { color: colors.textMuted }]}>Personal record</Text>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.metricsRow}>
          {/* Average Sleep */}
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={styles.metricCardHeader}>
              <View style={[styles.metricIconBox, { backgroundColor: colors.primarySoft }]}>
                <Ionicons name="time" size={18} color={colors.primary} />
              </View>
              <View style={[styles.pillTag, { backgroundColor: averageSleep >= goalMinutes ? colors.successSoft : colors.errorSoft }]}>
                <Text style={[styles.pillTagText, { color: averageSleep >= goalMinutes ? colors.success : colors.error }]}>
                  {averageSleep >= goalMinutes ? 'Target Met' : 'Under'}
                </Text>
              </View>
            </View>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Average Sleep</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{formatDuration(averageSleep)}</Text>
            <Text style={[styles.metricSub, { color: colors.textMuted }]}>Goal: {formatDuration(goalMinutes)}</Text>
          </View>

          {/* Goal Achieved */}
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={styles.metricCardHeader}>
              <View style={[styles.metricIconBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : colors.successSoft }]}>
                <Ionicons name="disc" size={18} color={colors.success} />
              </View>
              <View style={[styles.pillTag, { backgroundColor: colors.successSoft }]}>
                <Text style={[styles.pillTagText, { color: colors.success }]}>{achievedDays} Days</Text>
              </View>
            </View>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Goal Hit Rate</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>{completionPercentage}%</Text>
            <Text style={[styles.metricSub, { color: colors.textMuted }]}>{achievedDays} of {totalTracked} nights</Text>
          </View>
        </View>
      </View>

      {/* ========================================================= */}
      {/* RECENT SLEEP DURATION TRENDS CHART */}
      {/* ========================================================= */}
      <View style={styles.chartWrapper}>
        <SleepChart data={last7Days} title="Recent Sleep Trends (hrs)" />
      </View>

      {/* ========================================================= */}
      {/* QUALITY BREAKDOWN CARD */}
      {/* ========================================================= */}
      <View style={[styles.qualityCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={styles.qualityHeader}>
          <View style={styles.qualityTitleRow}>
            <Ionicons name="happy" size={18} color={colors.primary} style={styles.qualityIcon} />
            <Text style={[styles.qualityTitle, { color: colors.text }]}>Sleep Quality Breakdown</Text>
          </View>
          <Text style={[styles.qualitySub, { color: colors.textSecondary }]}>All records</Text>
        </View>

        <View style={styles.qualityBars}>
          {[
            { key: 'excellent', label: 'Excellent', icon: 'ribbon-outline', color: colors.sleepQuality.excellent },
            { key: 'good', label: 'Good', icon: 'happy-outline', color: colors.sleepQuality.good },
            { key: 'fair', label: 'Fair', icon: 'ellipse-outline', color: colors.sleepQuality.fair },
            { key: 'poor', label: 'Poor', icon: 'sad-outline', color: colors.sleepQuality.poor },
          ].map(q => {
            const count = qualityCounts[q.key];
            const pct = totalTracked > 0 ? Math.round((count / totalTracked) * 100) : 0;
            return (
              <View key={q.key} style={styles.qualityItem}>
                <View style={styles.qualityItemHeader}>
                  <View style={styles.qualityItemLeft}>
                    <Ionicons name={q.icon} size={14} color={q.color} style={styles.itemIcon} />
                    <Text style={[styles.qualityItemLabel, { color: colors.text }]}>{q.label}</Text>
                  </View>
                  <Text style={[styles.qualityItemCount, { color: colors.textSecondary }]}>
                    {count} nights ({pct}%)
                  </Text>
                </View>
                <View style={[styles.barBg, { backgroundColor: colors.surfaceSubtle }]}>
                  <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: q.color }]} />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* ========================================================= */}
      {/* STREAK MILESTONES */}
      {/* ========================================================= */}
      <View style={[styles.milestonesCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="shield-checkmark" size={18} color={colors.primary} style={styles.cardHeaderIcon} />
          <Text style={[styles.cardHeaderTitle, { color: colors.text }]}>Streak Badges</Text>
        </View>

        <View style={styles.milestonesRow}>
          {MILESTONES.map(m => {
            const unlocked = longestStreak >= m.days;
            return (
              <View key={m.days} style={[styles.milestoneItem, unlocked && styles.milestoneUnlocked]}>
                <View style={[
                  styles.milestoneIconWrapper, 
                  { 
                    backgroundColor: unlocked 
                      ? (isDark ? 'rgba(245, 158, 11, 0.2)' : colors.streakLight) 
                      : colors.surfaceSubtle 
                  }
                ]}>
                  <Ionicons 
                    name={unlocked ? m.icon : 'lock-closed'} 
                    size={20} 
                    color={unlocked ? colors.streak : colors.textMuted} 
                  />
                </View>
                <Text style={[styles.milestoneDays, unlocked && { color: colors.text }]}>{m.days} Days</Text>
                <Text style={[styles.milestoneLabel, { color: colors.textSecondary }]}>{m.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* ========================================================= */}
      {/* PAST 7 DAYS CONSISTENCY PROGRESS */}
      {/* ========================================================= */}
      <View style={[styles.weekCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar-outline" size={18} color={colors.primary} style={styles.cardHeaderIcon} />
          <Text style={[styles.cardHeaderTitle, { color: colors.text }]}>Past 7 Days Consistency</Text>
        </View>

        {weekDays.map((day, index) => {
          const tracked = getDayStatus(day);
          const isCurrentDay = index === 6;
          return (
            <View key={index} style={[styles.weekRow, { borderBottomColor: colors.borderLight }]}>
              <View style={styles.weekDayInfo}>
                <View style={[styles.statusIconBox, { backgroundColor: tracked ? colors.successSoft : colors.surfaceSubtle }]}>
                  <Ionicons 
                    name={tracked ? 'checkmark' : 'remove'} 
                    size={14} 
                    color={tracked ? colors.success : colors.textMuted} 
                  />
                </View>
                <Text style={[styles.weekDayText, { color: tracked ? colors.text : colors.textMuted }]}>
                  {format(day, 'EEEE, MMM d')}
                </Text>
              </View>

              {isCurrentDay ? (
                <View style={[styles.todayPill, { backgroundColor: colors.primarySoft }]}>
                  <Text style={[styles.todayLabel, { color: colors.primary }]}>Today</Text>
                </View>
              ) : (
                <Text style={[styles.loggedStatus, { color: tracked ? colors.success : colors.textMuted }]}>
                  {tracked ? 'Logged' : 'Missed'}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // Hero Card
  heroCard: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 3,
  },
  glowRingOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
  },
  glowRingInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroValue: {
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 58,
    letterSpacing: -1,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroMessage: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 270,
  },

  // Performance Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  totalTrackedBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  // 2x2 Metrics Grid
  metricsGrid: {
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTag: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  metricSub: {
    fontSize: 11,
  },

  // Chart Wrapper
  chartWrapper: {
    marginBottom: 16,
  },

  // Quality Card
  qualityCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
    marginRight: 8,
  },
  qualityTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  qualitySub: {
    fontSize: 12,
  },
  qualityBars: {
    gap: 12,
  },
  qualityItem: {
    marginBottom: 2,
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
  },
  qualityItemCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  barBg: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Milestones Card
  milestonesCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardHeaderIcon: {
    marginRight: 8,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  milestonesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milestoneItem: {
    alignItems: 'center',
    width: '23%',
    opacity: 0.5,
  },
  milestoneUnlocked: {
    opacity: 1,
  },
  milestoneIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  milestoneDays: {
    fontSize: 12,
    fontWeight: '700',
  },
  milestoneLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },

  // Week Card
  weekCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  weekDayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  weekDayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  todayPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  todayLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  loggedStatus: {
    fontSize: 12,
    fontWeight: '600',
  }
});

export default StreakScreen;
