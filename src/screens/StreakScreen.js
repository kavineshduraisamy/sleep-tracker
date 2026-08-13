import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SleepContext } from '../context/SleepContext';
import { colors } from '../constants/colors';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';
import { format, subDays } from 'date-fns';

const StreakScreen = () => {
  const { records } = useContext(SleepContext);

  const currentStreak = calculateCurrentStreak(records);
  const longestStreak = calculateLongestStreak(records);
  const totalTracked = records.length;

  // Generate this week's days
  const today = new Date();
  const weekDays = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i));
  
  const getDayStatus = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return records.some(r => r.date === dateStr);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.heroEmoji}>🔥</Text>
        <Text style={styles.heroValue}>{currentStreak}</Text>
        <Text style={styles.heroLabel}>DAY STREAK</Text>
        <Text style={styles.heroMessage}>Keep going!</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Your longest streak</Text>
          <Text style={styles.statValue}>{longestStreak} days</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total days tracked</Text>
          <Text style={styles.statValue}>{totalTracked} days</Text>
        </View>
      </View>

      <View style={styles.weekCard}>
        <Text style={styles.weekTitle}>This Week</Text>
        {weekDays.map((day, index) => {
          const tracked = getDayStatus(day);
          return (
            <View key={index} style={styles.weekRow}>
              <View style={styles.weekDayInfo}>
                <Text style={styles.weekCheck}>{tracked ? '✓' : '○'}</Text>
                <Text style={[styles.weekDayText, tracked && styles.weekDayTracked]}>
                  {format(day, 'EEEE')}
                </Text>
              </View>
              {index === 6 && <Text style={styles.todayLabel}>Today</Text>}
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
    paddingVertical: 40,
    backgroundColor: colors.surface,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: colors.streak,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 2,
    borderColor: `${colors.streak}20`,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  heroValue: {
    fontSize: 64,
    fontWeight: '900',
    color: colors.text,
    lineHeight: 70,
  },
  heroLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.streak,
    letterSpacing: 2,
    marginBottom: 12,
  },
  heroMessage: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  weekCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weekDayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekCheck: {
    fontSize: 18,
    color: colors.streak,
    marginRight: 12,
    width: 20,
    fontWeight: '700',
  },
  weekDayText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  weekDayTracked: {
    color: colors.text,
    fontWeight: '600',
  },
  todayLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
  }
});

export default StreakScreen;
