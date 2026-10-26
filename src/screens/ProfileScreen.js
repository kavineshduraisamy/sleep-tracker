import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Feather';
import { SleepContext } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';
import { calculateAge } from '../services/storage';
import { calculateAverageSleep, formatDuration } from '../utils/sleepUtils';
import { calculateLongestStreak } from '../utils/streakUtils';
import { format, parseISO } from 'date-fns';
import PrimaryButton from '../components/PrimaryButton';

const GENDERS = ['Male', 'Female', 'Rather not to say'];

const ProfileScreen = ({ navigation }) => {
  const { userProfile, updateProfile, records = [], settings } = useContext(SleepContext);
  const { theme, isDark, toggleTheme, colors } = useTheme();

  const name = userProfile?.name || 'Sleep Explorer';
  const dobStr = userProfile?.dob || '';
  const gender = userProfile?.gender || 'Rather not to say';

  const age = dobStr ? calculateAge(dobStr) : null;
  const formattedDob = dobStr ? format(parseISO(dobStr), 'MMMM do, yyyy') : 'Not set';

  // Stats calculation
  const totalTracked = records.length;
  const avgSleep = calculateAverageSleep(records);
  const longestStreak = calculateLongestStreak(records);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDob, setEditDob] = useState(dobStr ? parseISO(dobStr) : new Date(2000, 0, 1));
  const [editGender, setEditGender] = useState(gender);
  const [dobPickerOpen, setDobPickerOpen] = useState(false);

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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Profile Header Banner */}
      <View style={[styles.profileHeaderCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
        </View>

        <Text style={[styles.profileName, { color: colors.text }]}>{name}</Text>
        
        <View style={styles.badgeRow}>
          {age !== null && (
            <View style={[styles.pillBadge, { backgroundColor: colors.primarySoft }]}>
              <Icon name="clock" size={12} color={colors.primary} style={styles.badgeIcon} />
              <Text style={[styles.pillBadgeText, { color: colors.primary }]}>{age} Years Old</Text>
            </View>
          )}

          <View style={[styles.pillBadge, { backgroundColor: colors.surfaceSubtle }]}>
            <Icon name="user" size={12} color={colors.textSecondary} style={styles.badgeIcon} />
            <Text style={[styles.pillBadgeText, { color: colors.textSecondary }]}>{gender}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.editProfileBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight }]}
          onPress={handleOpenEdit}
          activeOpacity={0.7}
        >
          <Icon name="edit-2" size={14} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={[styles.editProfileBtnText, { color: colors.primary }]}>Edit Profile Details</Text>
        </TouchableOpacity>
      </View>

      {/* Personal Information Details */}
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={styles.sectionHeader}>
          <Icon name="user" size={16} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Details</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Full Name</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{name}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date of Birth</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{formattedDob}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Calculated Age</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{age !== null ? `${age} years` : '—'}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Gender Identity</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{gender}</Text>
        </View>
      </View>

      {/* Lifetime Sleep Stats Card */}
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={styles.sectionHeader}>
          <Icon name="activity" size={16} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sleep Journey</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.miniStatBox, { backgroundColor: colors.surfaceSubtle }]}>
            <Text style={[styles.miniStatVal, { color: colors.text }]}>{totalTracked}</Text>
            <Text style={[styles.miniStatLbl, { color: colors.textSecondary }]}>Nights Tracked</Text>
          </View>

          <View style={[styles.miniStatBox, { backgroundColor: colors.surfaceSubtle }]}>
            <Text style={[styles.miniStatVal, { color: colors.streak }]}>{longestStreak}d</Text>
            <Text style={[styles.miniStatLbl, { color: colors.textSecondary }]}>Best Streak</Text>
          </View>

          <View style={[styles.miniStatBox, { backgroundColor: colors.surfaceSubtle }]}>
            <Text style={[styles.miniStatVal, { color: colors.primary }]}>{formatDuration(avgSleep)}</Text>
            <Text style={[styles.miniStatLbl, { color: colors.textSecondary }]}>Avg Sleep</Text>
          </View>
        </View>
      </View>

      {/* App Appearance & Quick Settings */}
      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={styles.sectionHeader}>
          <Icon name="sliders" size={16} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance & Preferences</Text>
        </View>

        {/* Theme Switcher */}
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIconBox, { backgroundColor: colors.primarySoft }]}>
              <Icon name={isDark ? 'moon' : 'sun'} size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Theme</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                {isDark ? 'Dark Mode (Night)' : 'Light Mode (Day)'}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.themeToggleBtn, { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Icon name={isDark ? 'sun' : 'moon'} size={16} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.themeToggleText, { color: colors.primary }]}>
              Switch to {isDark ? 'Light' : 'Dark'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

        {/* Settings Navigation */}
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.settingIconBox, { backgroundColor: colors.surfaceSubtle }]}>
              <Icon name="settings" size={18} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Settings & Sleep Goals</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Daily target: {formatDuration(settings?.sleepGoalMinutes || 480)}</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
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
              <TouchableOpacity onPress={() => setEditModalOpen(false)}>
                <Icon name="x" size={20} color={colors.textSecondary} />
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
                <Icon name="calendar" size={16} color={colors.primary} />
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
  profileHeaderCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  badgeIcon: {
    marginRight: 5,
  },
  pillBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  editProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  miniStatBox: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  miniStatVal: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2,
  },
  miniStatLbl: {
    fontSize: 11,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  themeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  }
});

export default ProfileScreen;
