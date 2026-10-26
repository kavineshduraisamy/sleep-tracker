import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Feather';
import uuid from 'react-native-uuid';
import { SleepContext } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';
import { calculateSleepDuration, isGoalAchieved, formatDuration } from '../utils/sleepUtils';
import { format, subDays, isSameDay } from 'date-fns';

import PrimaryButton from '../components/PrimaryButton';
import TimePickerField from '../components/TimePickerField';

const QUALITIES = [
  { id: 'excellent', label: 'Excellent', sub: 'Deep & refreshed', icon: 'award', color: colors.sleepQuality.excellent },
  { id: 'good', label: 'Good', sub: 'Well rested', icon: 'smile', color: colors.sleepQuality.good },
  { id: 'fair', label: 'Fair', sub: 'Light / interrupted', icon: 'meh', color: colors.sleepQuality.fair },
  { id: 'poor', label: 'Poor', sub: 'Restless / tired', icon: 'frown', color: colors.sleepQuality.poor },
];

const SLEEP_FACTORS = [
  { id: 'caffeine', label: 'Caffeine', icon: 'coffee' },
  { id: 'exercise', label: 'Workout', icon: 'activity' },
  { id: 'screentime', label: 'Screen time', icon: 'tv' },
  { id: 'reading', label: 'Reading', icon: 'book-open' },
  { id: 'latemeal', label: 'Late meal', icon: 'wind' },
];

const LogSleepScreen = ({ navigation, route }) => {
  const { addRecord, settings, detectedSession } = useContext(SleepContext);
  const { colors } = useTheme();

  const goalMinutes = settings?.sleepGoalMinutes || 480;
  const initialAutoSession = route.params?.autoSession || detectedSession;

  // Default to manual entry mode
  const [entryMode, setEntryMode] = useState(route.params?.autoSession ? 'auto' : 'manual');

  const [date, setDate] = useState(
    initialAutoSession?.bedtime ? new Date(initialAutoSession.bedtime) : new Date()
  );
  const [bedtime, setBedtime] = useState(
    initialAutoSession?.bedtime 
      ? new Date(initialAutoSession.bedtime) 
      : new Date(new Date().setHours(22, 0, 0, 0))
  );
  const [wakeTime, setWakeTime] = useState(
    initialAutoSession?.wakeTime 
      ? new Date(initialAutoSession.wakeTime) 
      : new Date(new Date().setHours(6, 0, 0, 0))
  );
  const [quality, setQuality] = useState('good');
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [dateOpen, setDateOpen] = useState(false);

  useEffect(() => {
    if (initialAutoSession?.hasSession) {
      setBedtime(new Date(initialAutoSession.bedtime));
      setWakeTime(new Date(initialAutoSession.wakeTime));
      setDate(new Date(initialAutoSession.bedtime));
    }
  }, [initialAutoSession]);

  const durationMinutes = calculateSleepDuration(bedtime, wakeTime);
  const achieved = isGoalAchieved(durationMinutes, goalMinutes);

  const adjustTime = (type, minutesDelta) => {
    if (type === 'bedtime') {
      setBedtime(prev => new Date(prev.getTime() + minutesDelta * 60 * 1000));
    } else {
      setWakeTime(prev => new Date(prev.getTime() + minutesDelta * 60 * 1000));
    }
  };

  const toggleFactor = (factorId) => {
    setSelectedFactors(prev => 
      prev.includes(factorId) ? prev.filter(f => f !== factorId) : [...prev, factorId]
    );
  };

  const handleSave = () => {
    if (durationMinutes === 0) {
      Alert.alert('Invalid Times', 'Bedtime and wake time cannot be the same.');
      return;
    }

    if (durationMinutes > 24 * 60) {
      Alert.alert('Invalid Duration', 'Sleep duration cannot exceed 24 hours.');
      return;
    }

    const dateStr = format(date, 'yyyy-MM-dd');

    const record = {
      id: uuid.v4(),
      date: dateStr,
      bedtime: format(bedtime, 'h:mm a'),
      wakeTime: format(wakeTime, 'h:mm a'),
      durationMinutes,
      quality,
      factors: selectedFactors,
      notes: entryMode === 'auto' ? 'Auto-calculated via phone screen lock/unlock' : 'Manual entry',
      goalAchieved: achieved,
      trackingSource: entryMode === 'auto' ? 'screen_lock' : 'manual'
    };

    addRecord(record);
    navigation.goBack();
  };

  const isTodayDate = isSameDay(date, new Date());
  const isYesterdayDate = isSameDay(date, subDays(new Date(), 1));

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.content} 
      showsVerticalScrollIndicator={false}
    >
      {/* Mode Switcher: Auto Screen Lock vs Manual Entry */}
      <View style={[styles.modeSwitcherContainer, { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight }]}>
        <TouchableOpacity 
          style={[styles.modeTab, entryMode === 'auto' && [styles.modeTabActive, { backgroundColor: colors.surface }]]}
          onPress={() => setEntryMode('auto')}
          activeOpacity={0.8}
        >
          <Icon 
            name="smartphone" 
            size={16} 
            color={entryMode === 'auto' ? colors.primary : colors.textSecondary} 
            style={styles.modeTabIcon}
          />
          <Text style={[styles.modeTabText, entryMode === 'auto' && { color: colors.primary }]}>
            Auto Screen Lock
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.modeTab, entryMode === 'manual' && [styles.modeTabActive, { backgroundColor: colors.surface }]]}
          onPress={() => setEntryMode('manual')}
          activeOpacity={0.8}
        >
          <Icon 
            name="edit-3" 
            size={16} 
            color={entryMode === 'manual' ? colors.primary : colors.textSecondary} 
            style={styles.modeTabIcon}
          />
          <Text style={[styles.modeTabText, entryMode === 'manual' && { color: colors.primary }]}>
            Manual Entry
          </Text>
        </TouchableOpacity>
      </View>

      {/* AUTO MODE DETAILS */}
      {entryMode === 'auto' && (
        <View style={[styles.autoSectionCard, { backgroundColor: colors.surface, borderColor: `${colors.primary}30` }]}>
          <View style={styles.autoHeader}>
            <View style={styles.autoHeaderLeft}>
              <View style={[styles.autoIconBox, { backgroundColor: colors.primarySoft }]}>
                <Icon name="lock" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.autoTitle, { color: colors.text }]}>Lock to Unlock Calculation</Text>
                <Text style={[styles.autoSubtitle, { color: colors.textSecondary }]}>Sleep time calculated from phone inactivity</Text>
              </View>
            </View>
          </View>

          <View style={styles.detectedTimesRow}>
            {/* Bedtime / Lock */}
            <View style={[styles.timeCardBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight }]}>
              <View style={styles.timeCardTop}>
                <Icon name="moon" size={14} color={colors.primaryLight} />
                <Text style={[styles.timeCardLabel, { color: colors.textSecondary }]}>Screen Locked</Text>
              </View>
              <Text style={[styles.timeCardValue, { color: colors.text }]}>{format(bedtime, 'h:mm a')}</Text>
              
              <View style={styles.adjustRow}>
                <TouchableOpacity style={[styles.adjustBtn, { backgroundColor: colors.surface }]} onPress={() => adjustTime('bedtime', -15)}>
                  <Text style={[styles.adjustText, { color: colors.text }]}>-15m</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.adjustBtn, { backgroundColor: colors.surface }]} onPress={() => adjustTime('bedtime', 15)}>
                  <Text style={[styles.adjustText, { color: colors.text }]}>+15m</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.arrowDivider}>
              <Icon name="arrow-right" size={18} color={colors.textMuted} />
            </View>

            {/* Wake time / Unlock */}
            <View style={[styles.timeCardBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight }]}>
              <View style={styles.timeCardTop}>
                <Icon name="sun" size={14} color={colors.streak} />
                <Text style={[styles.timeCardLabel, { color: colors.textSecondary }]}>Screen Unlocked</Text>
              </View>
              <Text style={[styles.timeCardValue, { color: colors.text }]}>{format(wakeTime, 'h:mm a')}</Text>
              
              <View style={styles.adjustRow}>
                <TouchableOpacity style={[styles.adjustBtn, { backgroundColor: colors.surface }]} onPress={() => adjustTime('wakeTime', -15)}>
                  <Text style={[styles.adjustText, { color: colors.text }]}>-15m</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.adjustBtn, { backgroundColor: colors.surface }]} onPress={() => adjustTime('wakeTime', 15)}>
                  <Text style={[styles.adjustText, { color: colors.text }]}>+15m</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={[styles.autoHintBox, { backgroundColor: colors.primarySoft }]}>
            <Icon name="info" size={14} color={colors.primary} style={styles.autoHintIcon} />
            <Text style={[styles.autoHintText, { color: colors.primary }]}>
              Use the +/- buttons to adjust wind-down or morning wake buffers if needed.
            </Text>
          </View>
        </View>
      )}

      {/* MANUAL MODE DETAILS */}
      {entryMode === 'manual' && (
        <>
          {/* Date Selection Section */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Icon name="calendar" size={16} color={colors.primary} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Sleep Date</Text>
            </View>

            {/* Quick Date Chips */}
            <View style={styles.dateChipsRow}>
              <TouchableOpacity 
                style={[
                  styles.dateChip, 
                  { backgroundColor: colors.surface, borderColor: colors.borderLight },
                  isTodayDate && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]} 
                onPress={() => setDate(new Date())}
              >
                <Text style={[
                  styles.dateChipText, 
                  { color: colors.textSecondary },
                  isTodayDate && { color: '#FFFFFF', fontWeight: '700' }
                ]}>Today</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.dateChip, 
                  { backgroundColor: colors.surface, borderColor: colors.borderLight },
                  isYesterdayDate && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]} 
                onPress={() => setDate(subDays(new Date(), 1))}
              >
                <Text style={[
                  styles.dateChipText, 
                  { color: colors.textSecondary },
                  isYesterdayDate && { color: '#FFFFFF', fontWeight: '700' }
                ]}>Yesterday</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.dateChip, 
                  { backgroundColor: colors.surface, borderColor: colors.borderLight },
                  !isTodayDate && !isYesterdayDate && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]} 
                onPress={() => setDateOpen(true)}
              >
                <Icon 
                  name="calendar" 
                  size={13} 
                  color={!isTodayDate && !isYesterdayDate ? '#FFFFFF' : colors.textSecondary} 
                  style={styles.chipIcon}
                />
                <Text style={[
                  styles.dateChipText, 
                  { color: colors.textSecondary },
                  !isTodayDate && !isYesterdayDate && { color: '#FFFFFF', fontWeight: '700' }
                ]}>
                  {format(date, 'MMM d, yyyy')}
                </Text>
              </TouchableOpacity>
            </View>

            <DatePicker
              modal
              open={dateOpen}
              date={date}
              mode="date"
              maximumDate={new Date()}
              title="Choose Sleep Date"
              onConfirm={(d) => {
                setDateOpen(false);
                setDate(d);
              }}
              onCancel={() => setDateOpen(false)}
              textColor={colors.text}
            />
          </View>

          {/* Sleep Times Section */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Icon name="clock" size={16} color={colors.primary} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Sleep Schedule</Text>
            </View>

            <View style={styles.timeSection}>
              <TimePickerField 
                label="Went to bed" 
                value={bedtime} 
                onChange={setBedtime} 
                icon="moon"
                iconColor={colors.primary}
              />
              <TimePickerField 
                label="Woke up" 
                value={wakeTime} 
                onChange={setWakeTime} 
                icon="sun"
                iconColor={colors.streak}
              />
            </View>

            <TouchableOpacity 
              style={[styles.presetGoalBtn, { backgroundColor: colors.primarySoft, borderColor: `${colors.primary}35` }]}
              onPress={() => setWakeTime(new Date(bedtime.getTime() + goalMinutes * 60 * 1000))}
              activeOpacity={0.8}
            >
              <Icon name="target" size={14} color={colors.primary} style={styles.presetGoalBtnIcon} />
              <Text style={[styles.presetGoalBtnText, { color: colors.primary }]}>
                Set Wake Time for 8 hrs Goal ({format(new Date(bedtime.getTime() + goalMinutes * 60 * 1000), 'h:mm a')})
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Calculated Duration Card (Shown in Both Modes) */}
      <View style={[styles.durationCard, achieved && styles.durationCardAchieved]}>
        <View style={styles.durationTopRow}>
          <Text style={styles.durationLabel}>Calculated Sleep Duration</Text>
          <View style={[styles.durationStatusBadge, { backgroundColor: achieved ? colors.successSoft : colors.streakSoft }]}>
            <Icon 
              name={achieved ? 'check-circle' : 'alert-circle'} 
              size={12} 
              color={achieved ? colors.success : colors.streak} 
            />
            <Text style={[styles.durationStatusText, { color: achieved ? colors.success : colors.streak }]}>
              {achieved ? 'Target Met' : 'Below Target'}
            </Text>
          </View>
        </View>

        <Text style={styles.durationValue}>{formatDuration(durationMinutes)}</Text>
        <Text style={styles.goalHint}>Daily Goal: {formatDuration(goalMinutes)}</Text>
      </View>

      {/* Sleep Quality */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Icon name="smile" size={16} color={colors.primary} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>How was your sleep?</Text>
        </View>

        <View style={styles.qualityGrid}>
          {QUALITIES.map(q => {
            const isSelected = quality === q.id;
            return (
              <TouchableOpacity 
                key={q.id}
                style={[
                  styles.qualityCard, 
                  { backgroundColor: colors.surface, borderColor: colors.borderLight },
                  isSelected && { borderColor: q.color, backgroundColor: `${q.color}15` }
                ]}
                onPress={() => setQuality(q.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.qualityIconBox, { backgroundColor: isSelected ? q.color : colors.surfaceSubtle }]}>
                  <Icon 
                    name={q.icon} 
                    size={20} 
                    color={isSelected ? '#FFFFFF' : colors.textSecondary} 
                  />
                </View>
                <Text style={[styles.qualityLabel, { color: colors.text }, isSelected && { color: q.color }]}>
                  {q.label}
                </Text>
                <Text style={[styles.qualitySub, { color: colors.textSecondary }]}>{q.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Sleep Factors */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Icon name="tag" size={16} color={colors.primary} style={styles.sectionIcon} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Habits & Factors (Optional)</Text>
        </View>

        <View style={styles.factorsRow}>
          {SLEEP_FACTORS.map(f => {
            const isSelected = selectedFactors.includes(f.id);
            return (
              <TouchableOpacity 
                key={f.id}
                style={[
                  styles.factorChip, 
                  { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight },
                  isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => toggleFactor(f.id)}
                activeOpacity={0.8}
              >
                <Icon 
                  name={f.icon} 
                  size={14} 
                  color={isSelected ? '#FFFFFF' : colors.textSecondary} 
                  style={styles.factorIcon}
                />
                <Text style={[
                  styles.factorText, 
                  { color: colors.textSecondary },
                  isSelected && { color: '#FFFFFF', fontWeight: '700' }
                ]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Save Button */}
      <PrimaryButton 
        title={entryMode === 'auto' ? 'Confirm & Save Sleep Log' : 'Save Sleep Record'} 
        icon="check" 
        onPress={handleSave} 
        style={styles.saveBtn} 
      />
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
  modeSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  modeTabActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  modeTabIcon: {
    marginRight: 6,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modeTabTextActive: {
    color: colors.primary,
  },
  autoSectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: `${colors.primary}30`,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 3,
  },
  autoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  autoHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  autoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  autoSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detectedTimesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  timeCardBox: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  timeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  timeCardValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  arrowDivider: {
    paddingHorizontal: 8,
  },
  adjustRow: {
    flexDirection: 'row',
  },
  adjustBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  adjustText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  autoHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    padding: 10,
  },
  autoHintIcon: {
    marginRight: 6,
  },
  autoHintText: {
    fontSize: 11,
    color: colors.primaryDark,
    flex: 1,
    lineHeight: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  dateChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dateChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  dateChipTextActive: {
    color: colors.surface,
  },
  chipIcon: {
    marginRight: 6,
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  durationCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 3,
  },
  durationCardAchieved: {
    borderColor: `${colors.success}50`,
  },
  durationTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  durationLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  durationStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  durationStatusText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  durationValue: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
    marginVertical: 4,
  },
  goalHint: {
    fontSize: 12,
    color: colors.textMuted,
  },
  qualityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  qualityCard: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    marginBottom: 12,
    alignItems: 'center',
  },
  qualityIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  qualityLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  qualitySub: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  factorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  factorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  factorChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  factorIcon: {
    marginRight: 6,
  },
  factorText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  factorTextActive: {
    color: colors.surface,
  },
  presetGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.primary}25`,
    marginTop: 4,
  },
  presetGoalBtnIcon: {
    marginRight: 6,
  },
  presetGoalBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  saveBtn: {
    marginTop: 8,
    marginBottom: 20,
  }
});

export default LogSleepScreen;
