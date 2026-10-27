import AsyncStorage from '@react-native-async-storage/async-storage';

const RECORDS_KEY = '@sleep_records';
const SETTINGS_KEY = '@sleep_settings';
const PROFILE_KEY = '@user_profile';
const ONBOARDED_KEY = '@has_onboarded';

const DEFAULT_SETTINGS = {
  sleepGoalMinutes: 480, // 8 hours
  notificationsEnabled: true,
  screenLockTrackingEnabled: true, // Screen lock auto sleep detection
  theme: 'light', // 'light' | 'dark'
};

const DEFAULT_PROFILE = {
  name: '',
  dob: '', // 'YYYY-MM-DD'
  gender: '', // 'Male' | 'Female' | 'Rather not to say' | ''
};

/**
 * Calculate age from date of birth string (YYYY-MM-DD or Date object)
 */
export const calculateAge = (dob) => {
  if (!dob) return null;
  const birthDate = typeof dob === 'string' ? new Date(dob) : dob;
  if (isNaN(birthDate.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
};

export const saveSleepRecord = async (record) => {
  try {
    const existing = await getSleepRecords();
    const index = existing.findIndex(r => r.id === record.id);
    if (index >= 0) {
      existing[index] = record;
    } else {
      existing.push(record);
    }
    await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(existing));
    return existing;
  } catch (error) {
    console.error('Error saving sleep record', error);
    throw error;
  }
};

export const deleteSleepRecord = async (id) => {
  try {
    const existing = await getSleepRecords();
    const filtered = existing.filter(r => r.id !== id);
    await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error deleting sleep record', error);
    throw error;
  }
};

export const getSleepRecords = async () => {
  try {
    const data = await AsyncStorage.getItem(RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting sleep records', error);
    return [];
  }
};

export const getSettings = async () => {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting settings', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  } catch (error) {
    console.error('Error saving settings', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const data = await AsyncStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  } catch (error) {
    console.error('Error getting user profile', error);
    return DEFAULT_PROFILE;
  }
};

export const saveUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.error('Error saving user profile', error);
    throw error;
  }
};

export const getHasOnboarded = async () => {
  try {
    const data = await AsyncStorage.getItem(ONBOARDED_KEY);
    return data === 'true';
  } catch (error) {
    console.error('Error getting onboarding state', error);
    return false;
  }
};

export const setHasOnboarded = async (hasOnboarded) => {
  try {
    await AsyncStorage.setItem(ONBOARDED_KEY, hasOnboarded ? 'true' : 'false');
  } catch (error) {
    console.error('Error saving onboarding state', error);
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(RECORDS_KEY);
    await AsyncStorage.removeItem(SETTINGS_KEY);
    await AsyncStorage.removeItem(PROFILE_KEY);
    await AsyncStorage.removeItem(ONBOARDED_KEY);
  } catch (error) {
    console.error('Error clearing data', error);
    throw error;
  }
};
