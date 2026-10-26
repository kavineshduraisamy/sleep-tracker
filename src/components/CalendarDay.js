import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { isToday } from 'date-fns';

const CalendarDay = ({ day, isSelected, isCurrentMonth, status, onPress }) => {
  const { colors } = useTheme();
  const isCurrentDay = isToday(day);

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
        isCurrentDay && !isSelected && [styles.todayContainer, { borderColor: colors.primaryLight }],
        isSelected && [styles.selectedContainer, { backgroundColor: colors.primary, shadowColor: colors.primary }]
      ]} 
      onPress={() => onPress(day)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.dayText,
        { color: colors.text },
        !isCurrentMonth && { color: colors.textMuted, opacity: 0.4 },
        isCurrentDay && !isSelected && { color: colors.primary, fontWeight: '800' },
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
    width: 38,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginVertical: 3,
  },
  todayContainer: {
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
  },
  selectedContainer: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  dayText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
  }
});

export default CalendarDay;
