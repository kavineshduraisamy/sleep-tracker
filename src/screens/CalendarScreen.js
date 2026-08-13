import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SleepContext } from '../context/SleepContext';
import { colors } from '../constants/colors';
import { getNextMonth, getPrevMonth } from '../utils/calendarUtils';
import { format } from 'date-fns';

import Calendar from '../components/Calendar';
import SleepCard from '../components/SleepCard';

const CalendarScreen = () => {
  const { records, settings } = useContext(SleepContext);
  
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevMonth = () => setCurrentMonthDate(getPrevMonth(currentMonthDate));
  const handleNextMonth = () => setCurrentMonthDate(getNextMonth(currentMonthDate));

  // Find record for selected date
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedRecord = records.find(r => r.date === selectedDateStr);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Calendar 
        currentMonthDate={currentMonthDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        records={records}
        sleepGoalMinutes={settings.sleepGoalMinutes}
      />
      
      <View style={styles.recordContainer}>
        {selectedRecord ? (
          <SleepCard record={selectedRecord} />
        ) : (
          <View style={styles.emptyState}>
          </View>
        )}
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
  recordContainer: {
    marginTop: 24,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  }
});

export default CalendarScreen;
