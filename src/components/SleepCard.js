import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { formatDuration, calculateSleepDuration } from '../utils/sleepUtils';
import { formatDate } from '../utils/dateUtils';

const SleepCard = ({ record, onPress }) => {
  if (!record) return null;
  
  const qualityColor = colors.sleepQuality[record.quality] || colors.primary;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(record.date, 'EEEE, MMMM do')}</Text>
        {record.goalAchieved && (
          <View style={styles.badge}>
            <Icon name="check" size={12} color={colors.success} />
            <Text style={styles.badgeText}>Goal</Text>
          </View>
        )}
      </View>
      
      <View style={styles.body}>
        <View style={styles.durationContainer}>
          <Text style={styles.durationValue}>{formatDuration(record.durationMinutes)}</Text>
          <Text style={styles.timeRange}>{record.bedtime} → {record.wakeTime}</Text>
        </View>
        
        <View style={styles.qualityContainer}>
          <View style={[styles.qualityDot, { backgroundColor: qualityColor }]} />
          <Text style={styles.qualityText}>
            {record.quality.charAt(0).toUpperCase() + record.quality.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
    marginLeft: 4,
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  durationContainer: {
    flex: 1,
  },
  durationValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  timeRange: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  qualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  qualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  qualityText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  }
});

export default SleepCard;
