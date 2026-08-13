import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { getCalendarDays, formatMonthYear, getNextMonth, getPrevMonth, isCurrentMonth } from '../utils/calendarUtils';
import CalendarDay from './CalendarDay';
import { isSameDate } from '../utils/dateUtils';
import { format } from 'date-fns';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Calendar = ({ currentMonthDate, onPrevMonth, onNextMonth, selectedDate, onSelectDate, records, sleepGoalMinutes }) => {
  const days = getCalendarDays(currentMonthDate);

  const getDayStatus = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const record = records.find(r => r.date === dateStr);
    if (!record) return 'none';
    return record.durationMinutes >= sleepGoalMinutes ? 'achieved' : 'missed';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevMonth} style={styles.navButton}>
          <Icon name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{formatMonthYear(currentMonthDate)}</Text>
        <TouchableOpacity onPress={onNextMonth} style={styles.navButton}>
          <Icon name="chevron-right" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {DAYS_OF_WEEK.map(day => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  navButton: {
    padding: 8,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayWrapper: {
    width: '14.28%', // 100 / 7
    alignItems: 'center',
  }
});

export default Calendar;
