import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { getCalendarDays, formatMonthYear, isCurrentMonth } from '../utils/calendarUtils';
import CalendarDay from './CalendarDay';
import { isSameDate } from '../utils/dateUtils';
import { format } from 'date-fns';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Calendar = ({ 
  currentMonthDate, 
  onPrevMonth, 
  onNextMonth, 
  selectedDate, 
  onSelectDate, 
  records = [], 
  sleepGoalMinutes = 480 
}) => {
  const { colors } = useTheme();
  const days = getCalendarDays(currentMonthDate);

  const getDayStatus = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = records.find(r => r.date === dateStr);
    if (!record) return 'none';
    return record.durationMinutes >= sleepGoalMinutes ? 'achieved' : 'missed';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.cardShadow }]}>
      <View style={styles.header}>
        <View style={styles.monthGroup}>
          <Icon name="calendar" size={18} color={colors.primary} style={styles.calendarIcon} />
          <Text style={[styles.monthText, { color: colors.text }]}>{formatMonthYear(currentMonthDate)}</Text>
        </View>

        <View style={styles.navControls}>
          <TouchableOpacity 
            onPress={onPrevMonth} 
            style={[styles.navButton, { backgroundColor: colors.surfaceSubtle }]} 
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onNextMonth} 
            style={[styles.navButton, { backgroundColor: colors.surfaceSubtle }]} 
            activeOpacity={0.7}
          >
            <Icon name="chevron-right" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.weekDays, { borderBottomColor: colors.borderLight }]}>
        {DAYS_OF_WEEK.map(day => (
          <Text key={day} style={[styles.weekDayText, { color: colors.textSecondary }]}>{day}</Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {days.map((day, index) => (
          <View key={index} style={styles.dayWrapper}>
            <CalendarDay 
              day={day}
              isCurrentMonth={isCurrentMonth(day, currentMonthDate)}
              isSelected={isSameDate(day, selectedDate)}
              status={getDayStatus(day)}
              onPress={onSelectDate}
            />
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={[styles.legendContainer, { borderTopColor: colors.borderLight }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Goal Met</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.streak }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Under Goal</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Selected</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
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
    marginBottom: 20,
  },
  monthGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  navControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayWrapper: {
    width: '14.28%', // 100 / 7
    alignItems: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  }
});

export default Calendar;
