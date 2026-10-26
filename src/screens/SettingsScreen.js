import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SleepContext } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';
import { formatDuration } from '../utils/sleepUtils';

const SettingsScreen = () => {
  const { settings, updateSettings, resetData } = useContext(SleepContext);
  const { theme, isDark, setTheme, colors } = useTheme();
  
  const currentGoal = settings?.sleepGoalMinutes || 480;
  const currentNotif = settings?.notificationsEnabled || false;

  const [goalMinutes, setGoalMinutes] = useState(currentGoal);
  const [notifications, setNotifications] = useState(currentNotif);

  const handleGoalChange = (amount) => {
    const newValue = goalMinutes + amount;
    if (newValue >= 240 && newValue <= 840) { // between 4 and 14 hours
      setGoalMinutes(newValue);
      updateSettings({ sleepGoalMinutes: newValue });
    }
  };

  const toggleNotifications = (value) => {
    setNotifications(value);
    updateSettings({ notificationsEnabled: value });
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Sleep Data?',
      'This will permanently delete all your logged sleep records, streaks, and custom settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Erase Everything', 
          style: 'destructive', 
          onPress: async () => {
            await resetData();
            Alert.alert('Reset Complete', 'All sleep data has been successfully cleared.');
          } 
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Theme Mode Card */}
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.headerIconBox, { backgroundColor: colors.primarySoft }]}>
            <Icon name={isDark ? 'moon' : 'sun'} size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>Light or Dark theme</Text>
          </View>
        </View>

        <View style={styles.themeSelectorRow}>
          <TouchableOpacity 
            style={[
              styles.themeOptionCard, 
              !isDark && styles.themeOptionActive, 
              { backgroundColor: colors.surfaceSubtle, borderColor: !isDark ? colors.primary : colors.borderLight }
            ]}
            onPress={() => setTheme('light')}
            activeOpacity={0.8}
          >
            <View style={[styles.themeIconCircle, !isDark ? { backgroundColor: colors.primary } : { backgroundColor: colors.borderLight }]}>
              <Icon name="sun" size={18} color={!isDark ? '#FFFFFF' : colors.textSecondary} />
            </View>
            <Text style={[styles.themeOptionTitle, { color: !isDark ? colors.primary : colors.text }]}>Light Mode</Text>
            <Text style={[styles.themeOptionSub, { color: colors.textSecondary }]}>Daytime clarity</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.themeOptionCard, 
              isDark && styles.themeOptionActive, 
              { backgroundColor: colors.surfaceSubtle, borderColor: isDark ? colors.primary : colors.borderLight }
            ]}
            onPress={() => setTheme('dark')}
            activeOpacity={0.8}
          >
            <View style={[styles.themeIconCircle, isDark ? { backgroundColor: colors.primary } : { backgroundColor: colors.borderLight }]}>
              <Icon name="moon" size={18} color={isDark ? '#FFFFFF' : colors.textSecondary} />
            </View>
            <Text style={[styles.themeOptionTitle, { color: isDark ? colors.primary : colors.text }]}>Dark Mode</Text>
            <Text style={[styles.themeOptionSub, { color: colors.textSecondary }]}>Bedtime friendly</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Daily Sleep Goal Card */}
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.headerIconBox, { backgroundColor: colors.primarySoft }]}>
            <Icon name="target" size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Sleep Goal</Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>Target duration per night</Text>
          </View>
        </View>

        <View style={styles.goalController}>
          <TouchableOpacity 
            style={[styles.stepperBtn, { backgroundColor: colors.primarySoft }, goalMinutes <= 240 && styles.stepperDisabled]} 
            onPress={() => handleGoalChange(-30)}
            disabled={goalMinutes <= 240}
            activeOpacity={0.7}
          >
            <Icon name="minus" size={22} color={goalMinutes <= 240 ? colors.textMuted : colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.goalTextContainer}>
            <Text style={[styles.goalText, { color: colors.text }]}>{formatDuration(goalMinutes)}</Text>
            <Text style={[styles.goalUnits, { color: colors.textSecondary }]}>{Math.round(goalMinutes / 60 * 10) / 10} hours</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.stepperBtn, { backgroundColor: colors.primarySoft }, goalMinutes >= 840 && styles.stepperDisabled]} 
            onPress={() => handleGoalChange(30)}
            disabled={goalMinutes >= 840}
            activeOpacity={0.7}
          >
            <Icon name="plus" size={22} color={goalMinutes >= 840 ? colors.textMuted : colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Goal Presets */}
        <View style={styles.presetsRow}>
          {[
            { label: '7h', minutes: 420 },
            { label: '7.5h', minutes: 450 },
            { label: '8h (Goal)', minutes: 480 },
            { label: '8.5h', minutes: 510 },
            { label: '9h', minutes: 540 },
          ].map(p => {
            const isSelected = goalMinutes === p.minutes;
            return (
              <TouchableOpacity
                key={p.minutes}
                style={[
                  styles.presetChip, 
                  { backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle, borderColor: colors.borderLight }
                ]}
                onPress={() => {
                  setGoalMinutes(p.minutes);
                  updateSettings({ sleepGoalMinutes: p.minutes });
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.presetChipText, { color: isSelected ? '#FFFFFF' : colors.textSecondary }]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.recommendationBox, { backgroundColor: colors.primarySoft }]}>
          <Icon name="info" size={14} color={colors.primary} style={styles.recIcon} />
          <Text style={[styles.recommendationText, { color: colors.primary }]}>
            Medical experts recommend 7 - 9 hours (8 hours standard) of nightly sleep for optimal recovery.
          </Text>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.headerIconBox, { backgroundColor: colors.primarySoft }]}>
            <Icon name="sliders" size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>App notifications and habits</Text>
          </View>
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIconWrapper, { backgroundColor: colors.surfaceSubtle }]}>
              <Icon name="bell" size={16} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Bedtime Reminders</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Get notified 30 mins before sleep</Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={notifications ? colors.primary : colors.surface}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIconWrapper, { backgroundColor: colors.surfaceSubtle }]}>
              <Icon name="smartphone" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Screen Lock Sleep Tracker</Text>
              <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>Calculates sleep between lock and unlock</Text>
            </View>
          </View>
          <View style={[styles.activePill, { backgroundColor: colors.successSoft }]}>
            <Text style={[styles.activePillText, { color: colors.success }]}>Active</Text>
          </View>
        </View>
      </View>

      {/* About & Info */}
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.headerIconBox, { backgroundColor: colors.primarySoft }]}>
            <Icon name="shield" size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Privacy & Storage</Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>Local on-device data</Text>
          </View>
        </View>

        <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
          All sleep entries, user profile info, and statistics are saved 100% locally on your device via AsyncStorage. No health data leaves your phone.
        </Text>
      </View>

      {/* Danger Zone */}
      <View style={styles.dangerZone}>
        <Text style={[styles.dangerSectionTitle, { color: colors.textSecondary }]}>Data Management</Text>
        <TouchableOpacity style={[styles.resetBtn, { backgroundColor: colors.errorSoft, borderColor: `${colors.error}25` }]} onPress={handleReset} activeOpacity={0.8}>
          <View style={[styles.resetIconBox, { backgroundColor: colors.errorLight }]}>
            <Icon name="trash-2" size={18} color={colors.error} />
          </View>
          <View style={styles.resetTextGroup}>
            <Text style={[styles.resetText, { color: colors.error }]}>Reset All Sleep Records</Text>
            <Text style={[styles.resetSub, { color: colors.error }]}>Permanently clear all logs, profile, and streaks</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: 12,
    marginTop: 1,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOptionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    marginHorizontal: 4,
  },
  themeOptionActive: {
    elevation: 2,
  },
  themeIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  themeOptionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  themeOptionSub: {
    fontSize: 11,
  },
  goalController: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  stepperBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperDisabled: {
    opacity: 0.5,
  },
  goalTextContainer: {
    alignItems: 'center',
  },
  goalText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  goalUnits: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  recommendationBox: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 12,
    marginTop: 6,
    alignItems: 'center',
  },
  recIcon: {
    marginRight: 8,
  },
  recommendationText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  activePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 19,
  },
  dangerZone: {
    marginTop: 10,
    marginBottom: 20,
  },
  dangerSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  resetIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resetTextGroup: {
    flex: 1,
  },
  resetText: {
    fontSize: 15,
    fontWeight: '700',
  },
  resetSub: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  }
});

export default SettingsScreen;
