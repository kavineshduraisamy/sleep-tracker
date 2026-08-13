import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { formatDuration } from '../utils/sleepUtils';

const SleepGoalCard = ({ currentMinutes, goalMinutes }) => {
  const percentage = Math.min(Math.round((currentMinutes / goalMinutes) * 100), 100) || 0;
  const isAchieved = currentMinutes >= goalMinutes;
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Sleep Goal</Text>
        <Text style={styles.progressText}>{formatDuration(currentMinutes)} / {formatDuration(goalMinutes)}</Text>
      </View>
      
      <View style={styles.progressBarBg}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${percentage}%`, backgroundColor: isAchieved ? colors.success : colors.primary }
          ]} 
        />
      </View>
      
      <Text style={styles.subtitle}>
        {isAchieved ? 'Awesome! Goal achieved.' : 'Keep going!'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  }
});

export default SleepGoalCard;
