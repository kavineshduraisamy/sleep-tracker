import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const StreakCard = ({ currentStreak }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>Current Streak</Text>
        <View style={styles.streakContainer}>
          <Text style={styles.emoji}>🔥</Text>
          <Text style={styles.streakValue}>{currentStreak} Day{currentStreak !== 1 ? 's' : ''}</Text>
        </View>
      </View>
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
    borderLeftWidth: 4,
    borderLeftColor: colors.streak,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.streak}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  streakValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.streak,
  }
});

export default StreakCard;
