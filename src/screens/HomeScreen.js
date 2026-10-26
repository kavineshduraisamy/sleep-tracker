import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SleepContext } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';
import { getTodayStr, formatDate } from '../utils/dateUtils';
import { calculateCurrentStreak } from '../utils/streakUtils';
import { getWeeklySleepData, formatDuration } from '../utils/sleepUtils';

import SleepGoalCard from '../components/SleepGoalCard';
import StreakCard from '../components/StreakCard';
import PrimaryButton from '../components/PrimaryButton';

const HomeScreen = ({ navigation }) => {
  const { records = [], settings, userProfile, loading, detectedSession, dismissSession } = useContext(SleepContext);
  const { colors } = useTheme();

  const goalMinutes = settings?.sleepGoalMinutes || 480;

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Find today's record if it exists
  const todayStr = getTodayStr();
  const todayRecord = records.find(r => r.date === todayStr);
  
  // Or the most recent record
  const latestRecord = [...records].sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const currentStreak = calculateCurrentStreak(records);
  const weeklyData = getWeeklySleepData(records);

  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: 'sun', color: '#F59E0B' };
    if (hour < 18) return { text: 'Good afternoon', icon: 'sun', color: '#F97316' };
    return { text: 'Good evening', icon: 'moon', color: '#818CF8' };
  };

  const greeting = getGreetingData();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.content} 
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting Section */}
      <View style={styles.greetingHeader}>
        <View>
          <View style={styles.greetingRow}>
            <Text style={[styles.greetingText, { color: colors.text }]}>
              {greeting.text}{userProfile?.name ? `, ${userProfile.name}` : ''}
            </Text>
            <Icon name={greeting.icon} size={22} color={greeting.color} style={styles.greetingIcon} />
          </View>
          <Text style={[styles.subGreetingText, { color: colors.textSecondary }]}>
            Track your rest & recover better
          </Text>
        </View>
      </View>

      {/* Auto-Detected Sleep Banner via Screen Lock */}
      {detectedSession && (
        <View style={[styles.detectedBanner, { backgroundColor: colors.surface, borderColor: `${colors.primary}35` }]}>
          <View style={styles.detectedHeader}>
            <View style={styles.detectedTitleRow}>
              <View style={[styles.detectedIconBox, { backgroundColor: colors.primarySoft }]}>
                <Icon name="smartphone" size={16} color={colors.primary} />
              </View>
              <View style={styles.detectedTextGroup}>
                <Text style={[styles.detectedTitle, { color: colors.text }]}>Sleep Detected via Screen Lock</Text>
                <Text style={[styles.detectedTimeSub, { color: colors.textSecondary }]}>
                  Locked {detectedSession.formattedBedtime} → Unlocked {detectedSession.formattedWakeTime}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => dismissSession(detectedSession.sessionId)} 
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Icon name="x" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={[styles.detectedBottom, { borderTopColor: colors.borderLight }]}>
            <View style={[styles.detectedDurationPill, { backgroundColor: colors.primarySoft }]}>
              <Icon name="clock" size={13} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={[styles.detectedDurationText, { color: colors.primary }]}>{detectedSession.formattedDuration}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.detectedLogBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('LogSleep', { autoSession: detectedSession })}
              activeOpacity={0.8}
            >
              <Icon name="check" size={14} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.detectedLogBtnText}>Review & Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Hero Sleep Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Icon name="moon" size={13} color="#FDE047" style={styles.heroBadgeIcon} />
            <Text style={styles.heroBadgeText}>LAST NIGHT'S SLEEP</Text>
          </View>

          {latestRecord && (
            <View style={styles.qualityPill}>
              <Icon 
                name={latestRecord.quality === 'excellent' ? 'award' : 'smile'} 
                size={12} 
                color="#FFFFFF" 
                style={styles.qualityPillIcon} 
              />
              <Text style={styles.qualityPillText}>
                {latestRecord.quality ? latestRecord.quality.toUpperCase() : 'GOOD'}
              </Text>
            </View>
          )}
        </View>

        {latestRecord ? (
          <>
            <View style={styles.durationRow}>
              <Text style={styles.durationBig}>{formatDuration(latestRecord.durationMinutes)}</Text>
              {latestRecord.goalAchieved && (
                <View style={styles.goalPill}>
                  <Icon name="check" size={12} color="#FFFFFF" />
                  <Text style={styles.goalPillText}>Target Met</Text>
                </View>
              )}
            </View>

            <View style={styles.scheduleRow}>
              <View style={styles.scheduleItem}>
                <Icon name="moon" size={14} color="rgba(255,255,255,0.7)" style={styles.scheduleIcon} />
                <Text style={styles.scheduleLabel}>Bedtime</Text>
                <Text style={styles.scheduleValue}>{latestRecord.bedtime}</Text>
              </View>

              <View style={styles.scheduleDivider} />

              <View style={styles.scheduleItem}>
                <Icon name="sun" size={14} color="rgba(255,255,255,0.7)" style={styles.scheduleIcon} />
                <Text style={styles.scheduleLabel}>Wake Up</Text>
                <Text style={styles.scheduleValue}>{latestRecord.wakeTime}</Text>
              </View>

              <View style={styles.scheduleDivider} />

              <View style={styles.scheduleItem}>
                <Icon name="clock" size={14} color="rgba(255,255,255,0.7)" style={styles.scheduleIcon} />
                <Text style={styles.scheduleLabel}>Date</Text>
                <Text style={styles.scheduleValue}>{formatDate(latestRecord.date, 'MMM d')}</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.noDataHero}>
            <Text style={styles.noDataTitle}>No Sleep Logged Yet</Text>
            <Text style={styles.noDataDesc}>Log your latest bedtime and wake-up time to start generating insights.</Text>
            <TouchableOpacity 
              style={styles.heroActionBtn}
              onPress={() => navigation.navigate('LogSleep')}
              activeOpacity={0.85}
            >
              <Icon name="plus" size={16} color={colors.primary} style={styles.heroActionIcon} />
              <Text style={styles.heroActionText}>Log Sleep Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Target & Streak Cards */}
      {/* <SleepGoalCard 
        currentMinutes={todayRecord ? todayRecord.durationMinutes : 0} 
        goalMinutes={goalMinutes} 
      /> */}

      <StreakCard 
        currentStreak={currentStreak} 
        onPress={() => navigation.navigate('Streak')} 
      />

      {/* Weekly Sleep Consistency */}
      {weeklyData.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Icon name="calendar" size={16} color={colors.primary} style={styles.sectionIcon} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.weeklyList, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            {weeklyData.slice(0, 5).map(record => (
              <View key={record.id} style={[styles.weeklyItem, { borderBottomColor: colors.borderLight }]}>
                <View style={styles.weeklyLeft}>
                  <View style={[styles.weeklyDot, { backgroundColor: record.goalAchieved ? colors.success : colors.streak }]} />
                  <View>
                    <Text style={[styles.weeklyDay, { color: colors.text }]}>{formatDate(record.date, 'EEEE, MMM d')}</Text>
                    <Text style={[styles.weeklyTimeRange, { color: colors.textSecondary }]}>{record.bedtime} → {record.wakeTime}</Text>
                  </View>
                </View>
                
                <View style={styles.weeklyRight}>
                  <Text style={[styles.weeklyDuration, { color: colors.text }]}>{formatDuration(record.durationMinutes)}</Text>
                  {record.goalAchieved && (
                    <Icon name="check-circle" size={14} color={colors.success} style={styles.weeklyCheck} />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Quick Action Buttons */}
      <View style={styles.actions}>
        <PrimaryButton 
          title="Log Sleep" 
          icon="plus-circle"
          onPress={() => navigation.navigate('LogSleep')} 
          style={styles.actionBtn}
        />
        <PrimaryButton 
          title="View Calendar" 
          icon="calendar"
          variant="secondary"
          onPress={() => navigation.navigate('Calendar')}
        />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  headerBrandText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginLeft: 8,
    letterSpacing: -0.5,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  greetingHeader: {
    marginBottom: 20,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  greetingIcon: {
    marginLeft: 8,
  },
  subGreetingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  heroCard: {
    backgroundColor: colors.night,
    borderRadius: 26,
    padding: 22,
    marginBottom: 16,
    shadowColor: colors.night,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.nightCard,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  heroBadgeIcon: {
    marginRight: 5,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.8,
  },
  qualityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  qualityPillIcon: {
    marginRight: 4,
  },
  qualityPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 18,
  },
  durationBig: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  goalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12,
  },
  goalPillText: {
    fontSize: 11,
    color: '#34D399',
    fontWeight: '700',
    marginLeft: 4,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 12,
  },
  scheduleItem: {
    flex: 1,
    alignItems: 'center',
  },
  scheduleIcon: {
    marginBottom: 4,
  },
  scheduleLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  scheduleValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  scheduleDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 4,
  },
  noDataHero: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  noDataTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  noDataDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  heroActionIcon: {
    marginRight: 6,
  },
  heroActionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginTop: 20,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },
  weeklyList: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  weeklyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  weeklyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weeklyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  weeklyDay: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },
  weeklyTimeRange: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  weeklyRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weeklyDuration: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '800',
  },
  weeklyCheck: {
    marginLeft: 6,
  },
  actions: {
    marginTop: 24,
  },
  actionBtn: {
    marginBottom: 12,
  },
  detectedBanner: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: `${colors.primary}35`,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  detectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detectedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detectedIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  detectedTextGroup: {
    flex: 1,
  },
  detectedTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  detectedTimeSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detectedBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  detectedDurationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  detectedDurationText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  detectedLogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  detectedLogBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  }
});

export default HomeScreen;
