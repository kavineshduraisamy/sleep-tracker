import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { formatDuration } from '../utils/sleepUtils';

const SleepGoalCard = ({ currentMinutes = 0, goalMinutes = 480 }) => {
  const { colors } = useTheme();
  const percentage = Math.min(Math.round((currentMinutes / goalMinutes) * 100), 100) || 0;
  const isAchieved = currentMinutes >= goalMinutes;
  const remainingMinutes = Math.max(0, goalMinutes - currentMinutes);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.cardShadow }]}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <View style={[styles.iconBadge, { backgroundColor: isAchieved ? colors.successSoft : colors.primarySoft }]}>
            <Icon 
              name={isAchieved ? 'check-circle' : 'target'} 
              size={18} 
              color={isAchieved ? colors.success : colors.primary} 
            />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Sleep Target</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Goal: {formatDuration(goalMinutes)}/night
            </Text>
          </View>
        </View>

        <View style={[styles.percentBadge, { backgroundColor: isAchieved ? colors.successSoft : colors.primarySoft }]}>
          <Text style={[styles.percentText, { color: isAchieved ? colors.success : colors.primary }]}>
            {percentage}%
          </Text>
        </View>
      </View>
      
      <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceSubtle }]}>
        <View 
          style={[
            styles.progressBarFill, 
            { 
              width: `${Math.max(percentage, 4)}%`, 
              backgroundColor: isAchieved ? colors.success : colors.primary 
            }
          ]} 
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerLogged, { color: colors.textSecondary }]}>
          Logged: <Text style={[styles.boldText, { color: colors.text }]}>{formatDuration(currentMinutes)}</Text>
        </Text>
        <Text style={[styles.footerStatus, { color: isAchieved ? colors.success : colors.textSecondary }]}>
          {isAchieved 
            ? 'Goal achieved! 🎉' 
            : remainingMinutes > 0 
              ? `${formatDuration(remainingMinutes)} remaining`
              : 'Log today\'s sleep'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    marginVertical: 8,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  percentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLogged: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: colors.text,
  },
  footerStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusAchieved: {
    color: colors.success,
    fontWeight: '700',
  }
});

export default SleepGoalCard;
