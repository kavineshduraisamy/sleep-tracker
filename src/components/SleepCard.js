import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { formatDuration } from '../utils/sleepUtils';
import { formatDate } from '../utils/dateUtils';

const SleepCard = ({ record, onPress, onDelete }) => {
  const { colors } = useTheme();

  if (!record) return null;

  const qualityColor = colors.sleepQuality[record.quality] || colors.sleepQuality.good;
  const qualityBg = colors.sleepQualityBg[record.quality] || colors.sleepQualityBg.good;
  const qualityIcon = record.quality === 'excellent' ? 'award' : record.quality === 'poor' ? 'frown' : record.quality === 'fair' ? 'meh' : 'smile';
  const qualityLabel = record.quality ? record.quality.charAt(0).toUpperCase() + record.quality.slice(1) : 'Good';

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.cardShadow }]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      disabled={!onPress}
    >
      <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
        <View style={styles.dateGroup}>
          <Icon name="calendar" size={14} color={colors.textSecondary} style={styles.dateIcon} />
          <Text style={[styles.date, { color: colors.text }]}>{formatDate(record.date, 'EEEE, MMM d')}</Text>
        </View>

        <View style={styles.headerBadges}>
          {record.goalAchieved && (
            <View style={[styles.goalBadge, { backgroundColor: colors.successSoft }]}>
              <Icon name="check" size={11} color={colors.success} />
              <Text style={[styles.goalBadgeText, { color: colors.success }]}>Goal Met</Text>
            </View>
          )}

          <View style={[styles.qualityBadge, { backgroundColor: qualityBg }]}>
            <Icon name={qualityIcon} size={12} color={qualityColor} style={styles.qualityIcon} />
            <Text style={[styles.qualityText, { color: qualityColor }]}>{qualityLabel}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.body}>
        <View style={styles.durationBlock}>
          <Text style={[styles.durationValue, { color: colors.text }]}>{formatDuration(record.durationMinutes)}</Text>
          <Text style={[styles.durationLabel, { color: colors.textSecondary }]}>Total Sleep</Text>
        </View>
        
        <View style={[styles.timeBlock, { backgroundColor: colors.surfaceSubtle }]}>
          <View style={styles.timeRow}>
            <Icon name="moon" size={14} color={colors.primaryLight} style={styles.timeIcon} />
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Bedtime:</Text>
            <Text style={[styles.timeValue, { color: colors.text }]}>{record.bedtime}</Text>
          </View>
          <View style={styles.timeRow}>
            <Icon name="sun" size={14} color={colors.streak} style={styles.timeIcon} />
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Wake up:</Text>
            <Text style={[styles.timeValue, { color: colors.text }]}>{record.wakeTime}</Text>
          </View>
        </View>
      </View>

      {onDelete && (
        <TouchableOpacity 
          style={styles.deleteBtn} 
          onPress={() => onDelete(record.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="trash-2" size={16} color={colors.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginVertical: 6,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 10,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 6,
  },
  date: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },
  headerBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 6,
  },
  goalBadgeText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '700',
    marginLeft: 3,
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  qualityIcon: {
    marginRight: 4,
  },
  qualityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationBlock: {
    flex: 1,
  },
  durationValue: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  durationLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  timeBlock: {
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  timeIcon: {
    marginRight: 6,
    width: 16,
    textAlign: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 4,
  },
  timeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  deleteBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 6,
  }
});

export default SleepCard;
