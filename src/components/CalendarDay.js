import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';

const CalendarDay = ({ day, isSelected, isCurrentMonth, status, onPress }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'achieved': return colors.success;
      case 'missed': return colors.streak;
      default: return 'transparent';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.dayContainer, 
        isSelected && styles.selectedContainer
      ]} 
      onPress={() => onPress(day)}
    >
      <Text style={[
        styles.dayText,
        !isCurrentMonth && styles.notCurrentMonth,
        isSelected && styles.selectedText
      ]}>
        {day.getDate()}
      </Text>
      <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    width: 40,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginVertical: 4,
  },
  selectedContainer: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  notCurrentMonth: {
    color: colors.textSecondary,
    opacity: 0.5,
  },
  selectedText: {
    color: colors.surface,
    fontWeight: '700',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  }
});

export default CalendarDay;
