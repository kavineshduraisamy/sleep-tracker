import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

const StreakCard = ({ currentStreak = 0, onPress }) => {
  const { colors } = useTheme();
  const isZero = currentStreak === 0;

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.cardShadow }]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      disabled={!onPress}
    >
      <View style={styles.leftContent}>
        <View style={[styles.iconWrapper, { backgroundColor: isZero ? colors.surfaceSubtle : colors.streakLight }]}>
          <Icon 
            name="zap" 
            size={22} 
            color={isZero ? colors.textMuted : colors.streak} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Consistency Streak</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isZero 
              ? 'Log sleep to start your streak' 
              : currentStreak >= 7 
                ? 'Incredible dedication! 🔥' 
                : 'Building consistent habits'}
          </Text>
        </View>
      </View>

      <View style={styles.rightContent}>
        <View style={[styles.badge, { backgroundColor: isZero ? colors.surfaceSubtle : colors.streakSoft, borderColor: isZero ? colors.border : colors.streakLight }]}>
          <Text style={[styles.streakNumber, { color: isZero ? colors.textSecondary : colors.streak }]}>
            {currentStreak}
          </Text>
          <Text style={[styles.streakDays, { color: isZero ? colors.textMuted : colors.streak }]}>
            {currentStreak === 1 ? 'DAY' : 'DAYS'}
          </Text>
        </View>
        {onPress && (
          <Icon name="chevron-right" size={18} color={colors.textMuted} style={styles.chevron} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    marginVertical: 8,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  streakNumber: {
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 20,
  },
  streakDays: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  chevron: {
    marginLeft: 8,
  }
});

export default StreakCard;
