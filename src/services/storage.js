import AsyncStorage from '@react-native-async-storage/async-storage';

const RECORDS_KEY = '@sleep_records';
const SETTINGS_KEY = '@sleep_settings';

const DEFAULT_SETTINGS = {
  sleepGoalMinutes: 480, // 8 hours
  notificationsEnabled: true,
  darkMode: false,
};

export const saveSleepRecord = async (record) => {
  try {
    const existing = await getSleepRecords();
    // Check if editing existing or adding new
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

export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(RECORDS_KEY);
    await AsyncStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing data', error);
    throw error;
  }
};
