import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, ScrollView } from 'react-native';
import { SleepContext } from '../context/SleepContext';
import { colors } from '../constants/colors';
import PrimaryButton from '../components/PrimaryButton';
import { formatDuration } from '../utils/sleepUtils';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native';

const SettingsScreen = () => {
  const { settings, updateSettings, resetData } = useContext(SleepContext);
  
  // Local state for UI updates
  const [goalMinutes, setGoalMinutes] = useState(settings.sleepGoalMinutes);
  const [notifications, setNotifications] = useState(settings.notificationsEnabled);

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
      'Reset Data',
      'Are you sure you want to delete all sleep records and settings? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset Data', 
          style: 'destructive', 
          onPress: async () => {
            await resetData();
            Alert.alert('Data Reset', 'All data has been cleared.');
          } 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep Goal</Text>
        <View style={styles.goalController}>
          <TouchableOpacity 
            style={styles.iconBtn} 
            onPress={() => handleGoalChange(-30)}
          >
            <Icon name="minus" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.goalText}>{formatDuration(goalMinutes)}</Text>
          
          <TouchableOpacity 
            style={styles.iconBtn} 
            onPress={() => handleGoalChange(30)}
          >
            <Icon name="plus" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>Recommended goal is 7-9 hours for most adults.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Icon name="bell" size={20} color={colors.textSecondary} style={styles.settingIcon} />
            <Text style={styles.settingText}>Daily Reminders</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={notifications ? colors.primary : colors.surface}
          />
        </View>

      </View>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Icon name="trash-2" size={20} color={colors.error} style={styles.resetIcon} />
          <Text style={styles.resetText}>Reset All Data</Text>
        </TouchableOpacity>
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
  section: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  goalController: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  hint: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  dangerZone: {
    marginTop: 24,
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
  },
  resetIcon: {
    marginRight: 8,
  },
  resetText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
  }
});

export default SettingsScreen;
