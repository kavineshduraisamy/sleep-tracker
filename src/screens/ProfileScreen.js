import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Alert, 
  Switch, 
  Platform 
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SleepContext } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';
import { calculateAge } from '../services/storage';
import { calculateAverageSleep, formatDuration } from '../utils/sleepUtils';
import { calculateLongestStreak, calculateCurrentStreak } from '../utils/streakUtils';
import { format, parseISO } from 'date-fns';
import PrimaryButton from '../components/PrimaryButton';

const GENDERS = ['Male', 'Female', 'Rather not to say'];

const ProfileScreen = ({ navigation }) => {
  const { 
    userProfile, 
    updateProfile, 
    records = [], 
    settings, 
    updateSettings, 
    resetData 
  } = useContext(SleepContext);

  const { isDark, toggleTheme, colors } = useTheme();

  // User Profile
  const name = userProfile?.name || 'Sleep Explorer';
  const dobStr = userProfile?.dob || '';
  const gender = userProfile?.gender || '';
  const age = dobStr ? calculateAge(dobStr) : null;
  const formattedDob = dobStr ? format(parseISO(dobStr), 'MMMM do, yyyy') : 'Not set';

  // Stats calculation (Instagram-style header counters)
  const totalTracked = records.length;
  const avgSleep = calculateAverageSleep(records);
  const longestStreak = calculateLongestStreak(records);
  const currentStreak = calculateCurrentStreak(records);

  // Settings State
  const goalMinutes = settings?.sleepGoalMinutes || 480;
  const notifications = settings?.notificationsEnabled || false;
  const screenLockEnabled = settings?.screenLockTrackingEnabled !== false; // defaults to true

  // Edit Profile Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDob, setEditDob] = useState(dobStr ? parseISO(dobStr) : new Date(2000, 0, 1));
  const [editGender, setEditGender] = useState(gender);
  const [dobPickerOpen, setDobPickerOpen] = useState(false);

  // Quick Goal Change Handlers
  const handleGoalChange = (amount) => {
    const newValue = goalMinutes + amount;
    if (newValue >= 240 && newValue <= 840) {
      updateSettings({ sleepGoalMinutes: newValue });
    }
  };

  const handleSetExactGoal = (minutes) => {
    updateSettings({ sleepGoalMinutes: minutes });
  };

  const toggleNotifications = (value) => {
    updateSettings({ notificationsEnabled: value });
  };

  const toggleScreenLock = (value) => {
    updateSettings({ screenLockTrackingEnabled: value });
  };

  // Erase / Reset Data
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

  const handleOpenEdit = () => {
    setEditName(userProfile?.name || '');
    setEditDob(dobStr ? parseISO(dobStr) : new Date(2000, 0, 1));
    setEditGender(gender);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }

    updateProfile({
      name: editName.trim(),
      dob: format(editDob, 'yyyy-MM-dd'),
      gender: editGender,
    });

    setEditModalOpen(false);
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.content} 
      showsVerticalScrollIndicator={false}
    >
      {/* ========================================================= */}
      {/* INSTAGRAM-STYLE PROFILE HERO CARD */}
      {/* ========================================================= */}
      <View style={[styles.profileHeroCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        
        {/* Top Row: Avatar on Left + 3 Stats Columns on Right */}
        <View style={styles.heroTopRow}>
          {/* Instagram Story Gradient Ring & Avatar */}
          <View style={[styles.storyRing, { borderColor: colors.primary }]}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
            </View>
            <View style={[styles.avatarStatusBadge, { backgroundColor: colors.streak, borderColor: colors.surface }]}>
              <Ionicons name="moon" size={11} color="#FFFFFF" />
            </View>
          </View>

          {/* 3 Columns Stats (Posts / Followers / Following style) */}
          <View style={styles.statsCountersRow}>
            <View style={styles.statColumn}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{totalTracked}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Nights</Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />

            <View style={styles.statColumn}>
              <Text style={[styles.statNumber, { color: colors.streak }]}>{longestStreak}d</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Best Streak</Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />

            <View style={styles.statColumn}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{formatDuration(avgSleep)}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Sleep</Text>
            </View>
          </View>
        </View>

        {/* User Bio & Details */}
        <View style={styles.bioContainer}>
          <Text style={[styles.profileNameText, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.profileTagline, { color: colors.textSecondary }]}>
            🌙 Khythms Explorer • {currentStreak > 0 ? `🔥 ${currentStreak}-day active streak` : 'Ready for tonight'}
          </Text>

          {/* User Details Badges */}
          <View style={styles.bioBadgesRow}>
            {age !== null && (
              <View style={[styles.bioPill, { backgroundColor: colors.primarySoft }]}>
                <Ionicons name="calendar-outline" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={[styles.bioPillText, { color: colors.primary }]}>{age} Years</Text>
              </View>
            )}

            {!!gender && (
              <View style={[styles.bioPill, { backgroundColor: colors.surfaceSubtle }]}>
                <Ionicons name="person-outline" size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
                <Text style={[styles.bioPillText, { color: colors.textSecondary }]}>{gender}</Text>
              </View>
            )}

            <View style={[styles.bioPill, { backgroundColor: colors.surfaceSubtle }]}>
              <Ionicons name="bed-outline" size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={[styles.bioPillText, { color: colors.textSecondary }]}>{formatDuration(goalMinutes)} Goal</Text>
            </View>

            {/* Active / Inactive Screen Lock Status Badge */}
            <View 
              style={[
                styles.bioPill, 
                { 
                  backgroundColor: screenLockEnabled ? colors.successSoft : colors.surfaceSubtle,
                  borderColor: screenLockEnabled ? `${colors.success}35` : colors.borderLight,
                  borderWidth: 1
                }
              ]}
            >
              <Ionicons 
                name={screenLockEnabled ? "lock-closed" : "lock-open-outline"} 
                size={11} 
                color={screenLockEnabled ? colors.success : colors.textMuted} 
                style={{ marginRight: 4 }} 
              />
              <Text 
                style={[
                  styles.bioPillText, 
                  { color: screenLockEnabled ? colors.success : colors.textMuted }
                ]}
              >
                {screenLockEnabled ? 'Lock: Active' : 'Lock: Off'}
              </Text>
            </View>
          </View>
        </View>

        {/* Instagram Profile Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight }]}
            onPress={handleOpenEdit}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.themeQuickButton, { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={17} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ========================================================= */}
      {/* INSTAGRAM-STYLE GROUPED SETTINGS */}
      {/* ========================================================= */}

      {/* Group 1: Sleep Goals & Habits */}
      <View style={styles.sectionHeaderWrap}>
        <Text style={[styles.sectionGroupTitle, { color: colors.textSecondary }]}>Sleep Goals & Target</Text>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        {/* Daily Sleep Goal Stepper */}
        <View style={styles.goalRowHeader}>
          <View style={styles.settingIconTitleRow}>
            <View style={[styles.settingIconBox, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="time" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.settingItemTitle, { color: colors.text }]}>Daily Sleep Target</Text>
              <Text style={[styles.settingItemSub, { color: colors.textSecondary }]}>Optimal nightly sleep duration</Text>
            </View>
          </View>

          <View style={[styles.goalDurationBadge, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.goalDurationBadgeText, { color: colors.primary }]}>
              {formatDuration(goalMinutes)}
            </Text>
          </View>
        </View>

        {/* Stepper Controller */}
        <View style={[styles.stepperBox, { backgroundColor: colors.surfaceSubtle }]}>
          <TouchableOpacity 
            style={[styles.stepperActionBtn, { backgroundColor: colors.surface, borderColor: colors.borderLight }, goalMinutes <= 240 && styles.stepperBtnDisabled]}
            onPress={() => handleGoalChange(-30)}
            disabled={goalMinutes <= 240}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={20} color={goalMinutes <= 240 ? colors.textMuted : colors.primary} />
          </TouchableOpacity>

          <View style={styles.stepperValueContainer}>
            <Text style={[styles.stepperBigValue, { color: colors.text }]}>{formatDuration(goalMinutes)}</Text>
            <Text style={[styles.stepperSubValue, { color: colors.textSecondary }]}>
              {Math.round(goalMinutes / 60 * 10) / 10} hours / night
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.stepperActionBtn, { backgroundColor: colors.surface, borderColor: colors.borderLight }, goalMinutes >= 840 && styles.stepperBtnDisabled]}
            onPress={() => handleGoalChange(30)}
            disabled={goalMinutes >= 840}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color={goalMinutes >= 840 ? colors.textMuted : colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Goal Presets Chips */}
        <View style={styles.presetChipsRow}>
          {[
            { label: '7h', minutes: 420 },
            { label: '7.5h', minutes: 450 },
            { label: '8h (Std)', minutes: 480 },
            { label: '8.5h', minutes: 510 },
            { label: '9h', minutes: 540 },
          ].map(p => {
            const isSelected = goalMinutes === p.minutes;
            return (
              <TouchableOpacity
                key={p.minutes}
                style={[
                  styles.presetChipBtn, 
                  { 
                    backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle, 
                    borderColor: isSelected ? colors.primary : colors.borderLight 
                  }
                ]}
                onPress={() => handleSetExactGoal(p.minutes)}
                activeOpacity={0.7}
              >
                <Text style={[styles.presetChipText, { color: isSelected ? '#FFFFFF' : colors.textSecondary }]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.rowDivider, { backgroundColor: colors.borderLight }]} />

        {/* Bedtime Reminders */}
        <View style={styles.settingRow}>
          <View style={styles.settingIconTitleRow}>
            <View style={[styles.settingIconBox, { backgroundColor: isDark ? 'rgba(129, 140, 248, 0.18)' : '#EEF2FF' }]}>
              <Ionicons name="notifications-outline" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.settingItemTitle, { color: colors.text }]}>Bedtime Reminders</Text>
              <Text style={[styles.settingItemSub, { color: colors.textSecondary }]}>Alert 30 mins before sleep target</Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={notifications ? colors.primary : colors.surface}
          />
        </View>

        <View style={[styles.rowDivider, { backgroundColor: colors.borderLight }]} />

        {/* Screen Lock Auto Sleep Tracker */}
        <View style={styles.settingRow}>
          <View style={styles.settingIconTitleRow}>
            <View style={[styles.settingIconBox, { backgroundColor: screenLockEnabled ? (isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5') : colors.surfaceSubtle }]}>
              <Ionicons 
                name={screenLockEnabled ? "phone-portrait" : "phone-portrait-outline"} 
                size={18} 
                color={screenLockEnabled ? colors.success : colors.textSecondary} 
              />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <View style={styles.settingTitleWithBadge}>
                <Text style={[styles.settingItemTitle, { color: colors.text }]}>Screen Lock Auto Detection</Text>
                <View style={[styles.miniStatusBadge, { backgroundColor: screenLockEnabled ? colors.successSoft : colors.surfaceSubtle }]}>
                  <Text style={[styles.miniStatusBadgeText, { color: screenLockEnabled ? colors.success : colors.textMuted }]}>
                    {screenLockEnabled ? 'Active' : 'Off'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.settingItemSub, { color: colors.textSecondary }]}>
                {screenLockEnabled ? 'Detects sleep from phone lock to unlock' : 'Auto tracking is currently turned off'}
              </Text>
            </View>
          </View>
          <Switch
            value={screenLockEnabled}
            onValueChange={toggleScreenLock}
            trackColor={{ false: colors.border, true: isDark ? 'rgba(16, 185, 129, 0.4)' : colors.successLight }}
            thumbColor={screenLockEnabled ? colors.success : colors.surface}
          />
        </View>
      </View>

      {/* Group 2: Appearance & Preferences */}
      <View style={styles.sectionHeaderWrap}>
        <Text style={[styles.sectionGroupTitle, { color: colors.textSecondary }]}>App Appearance</Text>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingIconTitleRow}>
            <View style={[styles.settingIconBox, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.18)' : '#FEF3C7' }]}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={colors.warning} />
            </View>
            <View>
              <Text style={[styles.settingItemTitle, { color: colors.text }]}>Dark Mode</Text>
              <Text style={[styles.settingItemSub, { color: colors.textSecondary }]}>
                {isDark ? 'Bedtime-friendly night theme' : 'Crisp daylight clarity theme'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={isDark ? colors.primary : colors.surface}
          />
        </View>
      </View>

      {/* Group 3: Account & Personal Info */}
      <View style={styles.sectionHeaderWrap}>
        <Text style={[styles.sectionGroupTitle, { color: colors.textSecondary }]}>Personal Information</Text>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <TouchableOpacity style={styles.settingRow} onPress={handleOpenEdit} activeOpacity={0.7}>
          <View style={styles.settingIconTitleRow}>
            <View style={[styles.settingIconBox, { backgroundColor: colors.surfaceSubtle }]}>
              <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={[styles.settingItemTitle, { color: colors.text }]}>Full Name</Text>
              <Text style={[styles.settingItemSub, { color: colors.textSecondary }]}>{name}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={[styles.rowDivider, { backgroundColor: colors.borderLight }]} />

        <TouchableOpacity style={styles.settingRow} onPress={handleOpenEdit} activeOpacity={0.7}>
          <View style={styles.settingIconTitleRow}>
            <View style={[styles.settingIconBox, { backgroundColor: colors.surfaceSubtle }]}>
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={[styles.settingItemTitle, { color: colors.text }]}>Date of Birth</Text>
              <Text style={[styles.settingItemSub, { color: colors.textSecondary }]}>
                {formattedDob} {age !== null ? `(${age} years old)` : ''}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={[styles.rowDivider, { backgroundColor: colors.borderLight }]} />

        <TouchableOpacity style={styles.settingRow} onPress={handleOpenEdit} activeOpacity={0.7}>
          <View style={styles.settingIconTitleRow}>
            <View style={[styles.settingIconBox, { backgroundColor: colors.surfaceSubtle }]}>
              <Ionicons name="transgender-outline" size={18} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={[styles.settingItemTitle, { color: colors.text }]}>Gender Identity</Text>
              <Text style={[styles.settingItemSub, { color: colors.textSecondary }]}>{gender}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Group 4: Privacy Policies & Developer */}
      <View style={styles.sectionHeaderWrap}>
        <Text style={[styles.sectionGroupTitle, { color: colors.textSecondary }]}>Privacy Policy & Developer</Text>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        {/* Company & Developer Attribution Row */}
        <View style={styles.settingRow}>
          <View style={styles.settingIconTitleRow}>
            <View style={[styles.settingIconBox, { backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#EEF2FF' }]}>
              <Ionicons name="business-outline" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <View style={styles.settingTitleWithBadge}>
                <Text style={[styles.settingItemTitle, { color: colors.text }]}>Kavyn</Text>
                <View style={[styles.miniStatusBadge, { backgroundColor: colors.primarySoft }]}>
                  <Text style={[styles.miniStatusBadgeText, { color: colors.primary }]}>Developer</Text>
                </View>
              </View>
              <Text style={[styles.settingItemSub, { color: colors.textSecondary }]}>
                Created & Engineered by Kavinesh
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.rowDivider, { backgroundColor: colors.borderLight }]} />

        {/* Privacy Policy Link */}
        <TouchableOpacity 
          style={styles.settingRow} 
          onPress={() => setPrivacyModalOpen(true)}
          activeOpacity={0.7}
        >
          <View style={styles.settingIconTitleRow}>
            <View style={[styles.settingIconBox, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ECFDF5' }]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingItemTitle, { color: colors.text }]}>Privacy Policies</Text>
              <Text style={[styles.settingItemSub, { color: colors.textSecondary }]}>
                100% on-device data safety • Zero tracking
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={[styles.rowDivider, { backgroundColor: colors.borderLight }]} />

        {/* Local Storage Guarantee */}
        <View style={styles.settingRow}>
          <View style={styles.settingIconTitleRow}>
            <View style={[styles.settingIconBox, { backgroundColor: isDark ? 'rgba(56, 189, 248, 0.18)' : '#E0F2FE' }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.info} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingItemTitle, { color: colors.text }]}>Local Data Isolation</Text>
              <Text style={[styles.settingItemSub, { color: colors.textSecondary }]}>
                All biometrics & records stay securely in local AsyncStorage.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Group 5: Data Management */}
      <View style={styles.sectionHeaderWrap}>
        <Text style={[styles.sectionGroupTitle, { color: colors.textSecondary }]}>Data Management</Text>
      </View>

      <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        {/* Destructive Reset Row */}
        <TouchableOpacity style={styles.settingRow} onPress={handleReset} activeOpacity={0.7}>
          <View style={styles.settingIconTitleRow}>
            <View style={[styles.settingIconBox, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2' }]}>
              <Ionicons name="trash-outline" size={18} color={colors.error} />
            </View>
            <View>
              <Text style={[styles.settingItemTitle, { color: colors.error }]}>Reset All Sleep Records</Text>
              <Text style={[styles.settingItemSub, { color: colors.error, opacity: 0.8 }]}>
                Permanently clear all logs, streak and custom settings
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.versionFooter}>
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>Khythms • v1.0.0</Text>
        <Text style={[styles.developerCreditText, { color: colors.textMuted }]}>
          Developed by Kavyn
          {/* Kynelle  */}
        </Text>
      </View>

      {/* ========================================================= */}
      {/* EDIT PROFILE MODAL */}
      {/* ========================================================= */}
      <Modal
        visible={editModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile Details</Text>
              <TouchableOpacity 
                style={[styles.modalCloseBtn, { backgroundColor: colors.surfaceSubtle }]} 
                onPress={() => setEditModalOpen(false)}
              >
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Name input */}
            <View style={styles.modalField}>
              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Your Name</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surfaceSubtle, color: colors.text, borderColor: colors.borderLight }]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter name"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {/* DOB Picker */}
            <View style={styles.modalField}>
              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Date of Birth</Text>
              <TouchableOpacity 
                style={[styles.modalDateBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight }]}
                onPress={() => setDobPickerOpen(true)}
              >
                <Text style={{ color: colors.text, fontWeight: '700' }}>
                  {format(editDob, 'MMMM d, yyyy')} ({calculateAge(editDob)} yrs)
                </Text>
                <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              </TouchableOpacity>

              <DatePicker
                modal
                open={dobPickerOpen}
                date={editDob}
                mode="date"
                maximumDate={new Date()}
                minimumDate={new Date(1920, 0, 1)}
                onConfirm={(d) => {
                  setDobPickerOpen(false);
                  setEditDob(d);
                }}
                onCancel={() => setDobPickerOpen(false)}
                textColor={colors.text}
              />
            </View>

            {/* Gender Picker */}
            <View style={styles.modalField}>
              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Gender</Text>
              <View style={styles.genderOptions}>
                {GENDERS.map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.modalGenderChip,
                      { backgroundColor: editGender === g ? colors.primary : colors.surfaceSubtle },
                    ]}
                    onPress={() => setEditGender(g)}
                  >
                    <Text style={[styles.modalGenderText, { color: editGender === g ? '#FFFFFF' : colors.textSecondary }]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <PrimaryButton 
              title="Save Changes" 
              icon="check"
              onPress={handleSaveEdit}
              style={{ marginTop: 12 }}
            />
          </View>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* PRIVACY POLICY MODAL */}
      {/* ========================================================= */}
      <Modal
        visible={privacyModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPrivacyModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, styles.privacyModalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="shield-checkmark" size={22} color={colors.primary} style={{ marginRight: 8 }} />
                <View>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Privacy Policies</Text>
                  <Text style={[styles.modalSub, { color: colors.textSecondary }]}>Khythms • Kavyn</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.modalCloseBtn, { backgroundColor: colors.surfaceSubtle }]} 
                onPress={() => setPrivacyModalOpen(false)}
              >
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.privacyScroll} contentContainerStyle={{ paddingBottom: 16 }}>
              {/* Attribution banner */}
              <View style={[styles.attributionBanner, { backgroundColor: colors.primarySoft, borderColor: `${colors.primary}30` }]}>
                <Ionicons name="business-outline" size={20} color={colors.primary} style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.attributionTitle, { color: colors.primary }]}>Developed by Kavyn</Text>
                  <Text style={[styles.attributionSub, { color: colors.textSecondary }]}>Engineered & Designed by Kavinesh</Text>
                </View>
              </View>

              {/* Policy sections */}
              <View style={styles.policyBlock}>
                <Text style={[styles.policyHeading, { color: colors.text }]}>1. Privacy & Architecture</Text>
                <Text style={[styles.policyBody, { color: colors.textSecondary }]}>
                  Khythms is created and engineered by Kavinesh under Kavyn Company. The application is built with a strict local-first privacy standard. Your sleep cycles, bedtime habits, and recovery metrics are personal and sensitive. This data belongs exclusively to you.
                </Text>
              </View>

              <View style={styles.policyBlock}>
                <Text style={[styles.policyHeading, { color: colors.text }]}>2. Zero Remote Data Collection</Text>
                <Text style={[styles.policyBody, { color: colors.textSecondary }]}>
                  Khythms does not transmit, upload, or sync your data to any remote cloud servers. There are no advertising trackers, analytics SDKs, or data brokers embedded in this app.
                </Text>
              </View>

              <View style={styles.policyBlock}>
                <Text style={[styles.policyHeading, { color: colors.text }]}>3. On-Device Storage Only</Text>
                <Text style={[styles.policyBody, { color: colors.textSecondary }]}>
                  All sleep history, circadian goals, user profiles, and streak records are saved 100% locally on your smartphone via AsyncStorage.
                </Text>
              </View>

              <View style={styles.policyBlock}>
                <Text style={[styles.policyHeading, { color: colors.text }]}>4. Screen Lock Sensor Usage</Text>
                <Text style={[styles.policyBody, { color: colors.textSecondary }]}>
                  When Screen Lock Auto Detection is enabled, Khythms strictly reads system lock and unlock timestamps to calculate sleep duration. It never reads keystrokes, personal messages, or device notifications.
                </Text>
              </View>

              <View style={styles.policyBlock}>
                <Text style={[styles.policyHeading, { color: colors.text }]}>5. Complete Data Ownership & Erasure</Text>
                <Text style={[styles.policyBody, { color: colors.textSecondary }]}>
                  You have full authority over your logs. You can delete single entries in the History section or purge all records permanently via the "Reset All Sleep Records" option.
                </Text>
              </View>

              <View style={[styles.policyBlock, { marginBottom: 10 }]}>
                <Text style={[styles.policyHeading, { color: colors.text }]}>6. Organization & Creator</Text>
                <Text style={[styles.policyBody, { color: colors.textSecondary }]}>
                  • Application: Khythms Sleep Tracker{'\n'}
                  • Organization: Kavyn{'\n'}
                  • Created & Developed by: Kavinesh
                </Text>
              </View>
            </ScrollView>

            <PrimaryButton 
              title="I Understand & Agree" 
              icon="check"
              onPress={() => setPrivacyModalOpen(false)}
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // Instagram Profile Hero Card
  profileHeroCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  storyRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2.5,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  avatarStatusBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 3-Column Stats Row (Instagram style)
  statsCountersRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginLeft: 16,
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 28,
  },

  // User Bio
  bioContainer: {
    marginBottom: 16,
  },
  profileNameText: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  profileTagline: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 10,
  },
  bioBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  bioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  bioPillText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Instagram Action Buttons
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  themeQuickButton: {
    width: 42,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section Headers
  sectionHeaderWrap: {
    paddingHorizontal: 6,
    marginBottom: 8,
    marginTop: 4,
  },
  sectionGroupTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Settings Card & Rows (Instagram style grouped lists)
  settingsCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  goalRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalDurationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  goalDurationBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingIconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingItemTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingItemSub: {
    fontSize: 12,
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    marginVertical: 8,
  },
  activeStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeStatusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  settingTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  miniStatusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  miniStatusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },

  // Stepper Box
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 10,
    marginVertical: 6,
  },
  stepperActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.4,
  },
  stepperValueContainer: {
    alignItems: 'center',
  },
  stepperBigValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  stepperSubValue: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  // Preset Chips
  presetChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 4,
  },
  presetChipBtn: {
    flex: 1,
    paddingVertical: 7,
    marginHorizontal: 2,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Version Footer
  versionFooter: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalField: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalInput: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 15,
    fontWeight: '600',
  },
  modalDateBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 48,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalGenderChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  modalGenderText: {
    fontSize: 12,
    fontWeight: '700',
  },
  developerCreditText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
  privacyModalCard: {
    maxHeight: '85%',
  },
  privacyScroll: {
    maxHeight: 400,
  },
  modalSub: {
    fontSize: 12,
    marginTop: 1,
  },
  attributionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  attributionTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  attributionSub: {
    fontSize: 11,
    marginTop: 1,
  },
  policyBlock: {
    marginBottom: 14,
  },
  policyHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  policyBody: {
    fontSize: 12,
    lineHeight: 18,
  }
});

export default ProfileScreen;
