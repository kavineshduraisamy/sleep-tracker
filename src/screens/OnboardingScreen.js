import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Feather';
import { SleepContext } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';
import { calculateAge } from '../services/storage';
import { format, subYears } from 'date-fns';
import PrimaryButton from '../components/PrimaryButton';

const GENDERS = [
  { id: 'Male', label: 'Male', icon: 'user' },
  { id: 'Female', label: 'Female', icon: 'user' },
  { id: 'Rather not to say', label: 'Rather not to say', icon: 'shield' },
];

const OnboardingScreen = () => {
  const { completeOnboarding } = useContext(SleepContext);
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [dob, setDob] = useState(subYears(new Date(), 24)); // Default ~24 years
  const [hasPickedDob, setHasPickedDob] = useState(false);
  const [dobOpen, setDobOpen] = useState(false);
  const [gender, setGender] = useState('Male');

  const calculatedAge = hasPickedDob ? calculateAge(dob) : null;

  const handleFinish = () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter your name to personalize your sleep tracker.');
      return;
    }

    if (!hasPickedDob) {
      Alert.alert('Date of Birth Required', 'Please select your date of birth to calculate your sleep age.');
      return;
    }

    const profileData = {
      name: name.trim(),
      dob: format(dob, 'yyyy-MM-dd'),
      gender,
    };

    completeOnboarding(profileData);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      contentContainerStyle={styles.content} 
      showsVerticalScrollIndicator={false}
    >
      {/* Header Banner */}
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft, borderColor: `${colors.primary}25` }]}>
          <Icon name="moon" size={36} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Welcome to Somno</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Set up your personal sleep profile for tailored recovery insights.
        </Text>
      </View>

      {/* Form Card */}
      <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.cardShadow }]}>
        {/* Name Input */}
        <View style={styles.fieldGroup}>
          <View style={styles.fieldHeader}>
            <Icon name="user" size={15} color={colors.primary} style={styles.fieldIcon} />
            <Text style={[styles.fieldLabel, { color: colors.text }]}>What should we call you?</Text>
          </View>
          <View style={[styles.inputWrapper, { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight }]}>
            <TextInput
              style={[styles.textInput, { color: colors.text }]}
              placeholder="e.g. Alex"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Date of Birth Input */}
        <View style={styles.fieldGroup}>
          <View style={styles.fieldHeader}>
            <Icon name="calendar" size={15} color={colors.primary} style={styles.fieldIcon} />
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Date of Birth</Text>
            {calculatedAge !== null && (
              <View style={[styles.agePill, { backgroundColor: colors.successSoft }]}>
                <Text style={[styles.agePillText, { color: colors.success }]}>Age: {calculatedAge} yrs</Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={[
              styles.dateBtn, 
              { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight },
              hasPickedDob && { borderColor: `${colors.primary}50` }
            ]}
            onPress={() => setDobOpen(true)}
            activeOpacity={0.8}
          >
            <View style={styles.dateBtnLeft}>
              <Icon name="calendar" size={18} color={hasPickedDob ? colors.primary : colors.textMuted} />
              <Text style={[
                styles.dateBtnText, 
                { color: colors.textMuted },
                hasPickedDob && { color: colors.text, fontWeight: '700' }
              ]}>
                {hasPickedDob ? format(dob, 'MMMM d, yyyy') : 'Select your birthday'}
              </Text>
            </View>
            <Icon name="chevron-down" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <DatePicker
            modal
            open={dobOpen}
            date={dob}
            mode="date"
            maximumDate={new Date()}
            minimumDate={new Date(1920, 0, 1)}
            title="Select Date of Birth"
            onConfirm={(selectedDate) => {
              setDobOpen(false);
              setDob(selectedDate);
              setHasPickedDob(true);
            }}
            onCancel={() => setDobOpen(false)}
            textColor={colors.text}
          />
        </View>

        {/* Gender Selector */}
        <View style={styles.fieldGroup}>
          <View style={styles.fieldHeader}>
            <Icon name="users" size={15} color={colors.primary} style={styles.fieldIcon} />
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Gender</Text>
          </View>

          <View style={styles.genderRow}>
            {GENDERS.map(g => {
              const isSelected = gender === g.id;
              return (
                <TouchableOpacity
                  key={g.id}
                  style={[
                    styles.genderChip, 
                    { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight },
                    isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setGender(g.id)}
                  activeOpacity={0.8}
                >
                  <Icon 
                    name={g.icon} 
                    size={14} 
                    color={isSelected ? '#FFFFFF' : colors.textSecondary} 
                    style={styles.genderChipIcon} 
                  />
                  <Text style={[
                    styles.genderChipText, 
                    { color: colors.textSecondary },
                    isSelected && { color: '#FFFFFF', fontWeight: '700' }
                  ]}>
                    {g.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyNote}>
          <Icon name="shield" size={13} color={colors.success} style={{ marginRight: 6 }} />
          <Text style={styles.privacyText}>
            Your information is stored strictly on your device.
          </Text>
        </View>
      </View>

      {/* Continue Button */}
      <PrimaryButton
        title="Continue to Dashboard"
        icon="arrow-right"
        iconPosition="right"
        size="large"
        onPress={handleFinish}
        style={styles.finishBtn}
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
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: `${colors.primary}25`,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fieldIcon: {
    marginRight: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  agePill: {
    backgroundColor: colors.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  agePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.success,
  },
  inputWrapper: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 16,
  },
  textInput: {
    height: 50,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  dateBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 16,
    height: 52,
  },
  dateBtnPicked: {
    borderColor: `${colors.primary}40`,
  },
  dateBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textMuted,
    marginLeft: 10,
  },
  dateBtnTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  genderRow: {
    flexDirection: 'column',
    gap: 8,
  },
  genderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  genderChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderChipIcon: {
    marginRight: 10,
  },
  genderChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  genderChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  privacyText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  finishBtn: {
    marginBottom: 20,
  }
});

export default OnboardingScreen;
