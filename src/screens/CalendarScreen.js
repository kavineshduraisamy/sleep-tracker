import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SleepContext } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';
import { getNextMonth, getPrevMonth } from '../utils/calendarUtils';
import { format } from 'date-fns';

import Calendar from '../components/Calendar';
import SleepCard from '../components/SleepCard';
import PrimaryButton from '../components/PrimaryButton';

const CalendarScreen = ({ navigation }) => {
  const { records = [], settings, removeRecord } = useContext(SleepContext);
  const { colors } = useTheme();
  
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevMonth = () => setCurrentMonthDate(getPrevMonth(currentMonthDate));
  const handleNextMonth = () => setCurrentMonthDate(getNextMonth(currentMonthDate));

  // Find record for selected date
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedRecord = records.find(r => r.date === selectedDateStr);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.content} 
      showsVerticalScrollIndicator={false}
    >
      {/* Calendar Card */}
      <Calendar 
        currentMonthDate={currentMonthDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        records={records}
        sleepGoalMinutes={settings?.sleepGoalMinutes || 480}
      />
      
      {/* Selected Date Detail Section */}
      <View style={styles.recordContainer}>
        <View style={styles.detailHeader}>
          <Icon name="calendar" size={16} color={colors.primary} style={styles.headerIcon} />
          <Text style={[styles.detailTitle, { color: colors.text }]}>
            {format(selectedDate, 'EEEE, MMMM do, yyyy')}
          </Text>
        </View>

        {selectedRecord ? (
          <SleepCard 
            record={selectedRecord} 
            onDelete={removeRecord}
          />
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={[styles.emptyIconBox, { backgroundColor: colors.primarySoft }]}>
              <Icon name="moon" size={24} color={colors.primaryLight} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Sleep Entry</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>No sleep log was recorded for this selected day.</Text>
            <PrimaryButton 
              title="Log Sleep for this Day" 
              icon="plus" 
              size="small"
              onPress={() => navigation.navigate('LogSleep')} 
              style={styles.emptyBtn}
            />
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
    marginTop: 22,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIcon: {
    marginRight: 8,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyBtn: {
    paddingHorizontal: 18,
  }
});

export default CalendarScreen;
