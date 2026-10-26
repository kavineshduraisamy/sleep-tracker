import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { SleepContext } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';
import { calculateAverageSleep, formatDuration } from '../utils/sleepUtils';
import SleepCard from '../components/SleepCard';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';

const HistoryScreen = ({ navigation }) => {
  const { records = [], removeRecord, settings } = useContext(SleepContext);
  const { colors } = useTheme();

  const goalMinutes = settings?.sleepGoalMinutes || 480;
  const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Sleep Record',
      'Are you sure you want to delete this sleep entry? This action cannot be reversed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => removeRecord(id) 
        }
      ]
    );
  };

  const handlePressRecord = (record) => {
    Alert.alert(
      'Sleep Record Options',
      `${record.date}: ${record.bedtime} to ${record.wakeTime} (${formatDuration(record.durationMinutes)})`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Delete Record', style: 'destructive', onPress: () => handleDelete(record.id) }
      ]
    );
  };

  if (sortedRecords.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState 
          icon="clock"
          title="No Sleep History Yet"
          message="Your logged sleep nights and habits will appear here in chronological order."
          action={
            <PrimaryButton 
              title="Log First Sleep" 
              icon="plus-circle"
              onPress={() => navigation.navigate('LogSleep')} 
            />
          }
        />
      </View>
    );
  }

  const avgSleep = calculateAverageSleep(sortedRecords);
  const achievedCount = sortedRecords.filter(r => r.durationMinutes >= goalMinutes).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Summary Header Strip */}
      <View style={[styles.summaryBar, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Logged</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{sortedRecords.length} nights</Text>
        </View>

        <View style={[styles.summaryDivider, { backgroundColor: colors.borderLight }]} />

        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Average Sleep</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatDuration(avgSleep)}</Text>
        </View>

        <View style={[styles.summaryDivider, { backgroundColor: colors.borderLight }]} />

        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Goals Met</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            {achievedCount} / {sortedRecords.length}
          </Text>
        </View>
      </View>

      <FlatList
        data={sortedRecords}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SleepCard 
            record={item} 
            onPress={() => handlePressRecord(item)}
            onDelete={handleDelete}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  }
});

export default HistoryScreen;
