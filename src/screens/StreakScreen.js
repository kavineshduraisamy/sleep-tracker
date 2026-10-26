import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SleepContext } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';
import { format, subDays } from 'date-fns';

const MILESTONES = [
  { days: 3, label: '3-Day Starter', icon: 'zap' },
  { days: 7, label: 'Week Warrior', icon: 'award' },
  { days: 14, label: 'Habit Master', icon: 'shield' },
  { days: 30, label: 'Sleep Champion', icon: 'star' },
];

const StreakScreen = () => {
  const { records = [] } = useContext(SleepContext);
  const { colors } = useTheme();

  const currentStreak = calculateCurrentStreak(records);
  const longestStreak = calculateLongestStreak(records);
  const totalTracked = records.length;

  // Generate this week's days (last 7 days)
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
      {/* Hero Streak Card */}
      <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: `${colors.streak}30` }]}>
        <View style={styles.glowRingOuter}>
          <View style={styles.glowRingInner}>
            <Icon name="zap" size={40} color={colors.streak} />
          </View>
        </View>

        <Text style={[styles.heroValue, { color: colors.text }]}>{currentStreak}</Text>
        <Text style={styles.heroLabel}>DAY STREAK</Text>
        
        <View style={[styles.tierBadge, { backgroundColor: `${tier.color}15`, borderColor: `${tier.color}40` }]}>
          <Text style={[styles.tierText, { color: tier.color }]}>{tier.label}</Text>
        </View>

        <Text style={[styles.heroMessage, { color: colors.textSecondary }]}>
          {currentStreak === 0 
            ? 'Track consecutive nights to build your streak.' 
            : 'Sleep habits improve when kept regular. Keep going!'}
        </Text>
      </View>

      {/* Stats Summary Grid */}
      <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.cardShadow }]}>
        <View style={styles.statCol}>
          <View style={[styles.statIconBox, { backgroundColor: colors.surfaceSubtle }]}>
            <Icon name="award" size={18} color={colors.streak} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{longestStreak} Days</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Best Streak</Text>
        </View>

        <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />

        <View style={styles.statCol}>
          <View style={[styles.statIconBox, { backgroundColor: colors.surfaceSubtle }]}>
            <Icon name="check-circle" size={18} color={colors.success} />
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>{totalTracked} Days</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Tracked</Text>
        </View>
      </View>

      {/* Milestones Card */}
      <View style={[styles.milestonesCard, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.cardShadow }]}>
        <View style={styles.cardHeader}>
          <Icon name="shield" size={18} color={colors.primary} style={styles.cardHeaderIcon} />
          <Text style={[styles.cardHeaderTitle, { color: colors.text }]}>Streak Badges</Text>
        </View>

        <View style={styles.milestonesRow}>
          {MILESTONES.map(m => {
            const unlocked = longestStreak >= m.days;
            return (
              <View key={m.days} style={[styles.milestoneItem, unlocked && styles.milestoneUnlocked]}>
                <View style={[styles.milestoneIconWrapper, { backgroundColor: unlocked ? colors.streakLight : colors.surfaceSubtle }]}>
                  <Icon 
                    name={unlocked ? m.icon : 'lock'} 
                    size={20} 
                    color={unlocked ? colors.streak : colors.textMuted} 
                  />
                </View>
                <Text style={[styles.milestoneDays, unlocked && styles.milestoneDaysActive]}>{m.days} Days</Text>
                <Text style={[styles.milestoneLabel, { color: colors.textSecondary }]}>{m.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Weekly Consistency Progress */}
      <View style={[styles.weekCard, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.cardShadow }]}>
        <View style={styles.cardHeader}>
          <Icon name="calendar" size={18} color={colors.primary} style={styles.cardHeaderIcon} />
          <Text style={[styles.cardHeaderTitle, { color: colors.text }]}>Past 7 Days</Text>
        </View>

        {weekDays.map((day, index) => {
          const tracked = getDayStatus(day);
          const isCurrentDay = index === 6;
          return (
            <View key={index} style={[styles.weekRow, { borderBottomColor: colors.borderLight }]}>
              <View style={styles.weekDayInfo}>
                <View style={[styles.statusIconBox, { backgroundColor: tracked ? colors.successSoft : colors.surfaceSubtle }]}>
                  <Icon 
                    name={tracked ? 'check' : 'minus'} 
                    size={14} 
                    color={tracked ? colors.success : colors.textMuted} 
                  />
                </View>
                <Text style={[styles.weekDayText, { color: tracked ? colors.text : colors.textMuted }]}>
                  {format(day, 'EEEE, MMM d')}
                </Text>
              </View>

              {isCurrentDay ? (
                <View style={styles.todayPill}>
                  <Text style={styles.todayLabel}>Today</Text>
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
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: colors.streak,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: `${colors.streak}30`,
  },
  glowRingOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.streakSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${colors.streak}40`,
  },
  glowRingInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.streakLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroValue: {
    fontSize: 56,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 62,
    letterSpacing: -1,
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.streak,
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
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 3,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 6,
  },
  milestonesCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderIcon: {
    marginRight: 8,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  milestonesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milestoneItem: {
    alignItems: 'center',
    width: '23%',
    opacity: 0.6,
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
    color: colors.textSecondary,
  },
  milestoneDaysActive: {
    color: colors.text,
  },
  milestoneLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  weekCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 3,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
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
    color: colors.textSecondary,
    fontWeight: '600',
  },
  weekDayTracked: {
    color: colors.text,
    fontWeight: '700',
  },
  todayPill: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  todayLabel: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '800',
  },
  loggedStatus: {
    fontSize: 12,
    fontWeight: '600',
  }
});

export default StreakScreen;
