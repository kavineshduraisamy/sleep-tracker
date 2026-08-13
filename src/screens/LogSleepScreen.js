import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import uuid from 'react-native-uuid';
import { SleepContext } from '../context/SleepContext';
import { colors } from '../constants/colors';
import { calculateSleepDuration, isGoalAchieved } from '../utils/sleepUtils';
import { format, subDays } from 'date-fns';

import PrimaryButton from '../components/PrimaryButton';
import TimePickerField from '../components/TimePickerField';

const QUALITIES = ['poor', 'fair', 'good', 'excellent'];

const LogSleepScreen = ({ navigation }) => {
  const { addRecord, settings } = useContext(SleepContext);

  const [date, setDate] = useState(new Date());
  const [bedtime, setBedtime] = useState(new Date(new Date().setHours(22, 0, 0, 0))); // Default 10 PM
  const [wakeTime, setWakeTime] = useState(new Date(new Date().setHours(6, 0, 0, 0))); // Default 6 AM
  const [quality, setQuality] = useState('good');

  const [dateOpen, setDateOpen] = useState(false);

  const handleSave = () => {
    // Format times for storage
    const bedtimeStr = format(bedtime, 'HH:mm');
    const wakeTimeStr = format(wakeTime, 'HH:mm');
    const dateStr = format(date, 'yyyy-MM-dd');

    const durationMinutes = calculateSleepDuration(bedtime, wakeTime);

    if (durationMinutes === 0) {
      Alert.alert('Invalid Times', 'Bedtime and wake time cannot be the same.');
      return;
    }

    if (durationMinutes > 24 * 60) {
      Alert.alert('Invalid Duration', 'Sleep duration cannot exceed 24 hours.');
      return;
    }

    const record = {
      id: uuid.v4(),
      date: dateStr,
      bedtime: format(bedtime, 'h:mm a'), // e.g. 10:00 PM for display
      wakeTime: format(wakeTime, 'h:mm a'),
      durationMinutes,
      quality,
      notes: '',
      goalAchieved: isGoalAchieved(durationMinutes, settings.sleepGoalMinutes)
    };

    addRecord(record);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep Date</Text>
        <TouchableOpacity style={styles.datePickerBtn} onPress={() => setDateOpen(true)}>
          <Text style={styles.dateText}>{format(date, 'EEEE, MMMM do, yyyy')}</Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={dateOpen}
          date={date}
          mode="date"
          maximumDate={new Date()}
          onConfirm={(d) => {
            setDateOpen(false);
            setDate(d);
          }}
          onCancel={() => setDateOpen(false)}
          textColor={colors.text}
        />
      </View>

      <View style={styles.timeSection}>
        <TimePickerField label="Bedtime" value={bedtime} onChange={setBedtime} />
        <TimePickerField label="Wake-up Time" value={wakeTime} onChange={setWakeTime} />
      </View>

      <View style={styles.durationCard}>
        <Text style={styles.durationLabel}>Calculated Duration</Text>
        <Text style={styles.durationValue}>
          {Math.floor(calculateSleepDuration(bedtime, wakeTime) / 60)}h{' '}
          {calculateSleepDuration(bedtime, wakeTime) % 60}m
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep Quality</Text>
        <View style={styles.qualityContainer}>
          {QUALITIES.map(q => (
            <TouchableOpacity 
              key={q}
              style={[styles.qualityBtn, quality === q && styles.qualityBtnActive]}
              onPress={() => setQuality(q)}
            >
              <Text style={[styles.qualityText, quality === q && styles.qualityTextActive]}>
                {q.charAt(0).toUpperCase() + q.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <PrimaryButton title="Save Sleep Record" onPress={handleSave} style={styles.saveBtn} />
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  datePickerBtn: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  durationCard: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  durationLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  durationValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
  },
  qualityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  qualityBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  qualityBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  qualityText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  qualityTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },
  saveBtn: {
    marginTop: 16,
  }
});

export default LogSleepScreen;
