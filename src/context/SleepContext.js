import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  getSleepRecords, 
  saveSleepRecord, 
  deleteSleepRecord,
  getSettings,
  saveSettings,
  getUserProfile,
  saveUserProfile,
  getHasOnboarded,
  setHasOnboarded,
  clearAllData
} from '../services/storage';
import { 
  initScreenLockTracker, 
  getDetectedSleepSession, 
  dismissDetectedSession,
  clearDetectedSession
} from '../services/screenLockService';

export const SleepContext = createContext();

export const SleepProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [settings, setSettings] = useState(null);
  const [userProfile, setUserProfile] = useState({ name: '', dob: '', gender: 'Rather not to say' });
  const [hasOnboarded, setHasOnboardedState] = useState(true); // default true while loading
  const [loading, setLoading] = useState(true);
  const [detectedSession, setDetectedSession] = useState(null);

  const checkDetected = useCallback(async (currentRecords, currentSettings) => {
    try {
      const activeSettings = currentSettings || settings;
      if (activeSettings && activeSettings.screenLockTrackingEnabled === false) {
        setDetectedSession(null);
        return;
      }

      const session = await getDetectedSleepSession();
      if (session.hasSession) {
        const recs = currentRecords || records;
        const alreadyLogged = recs.some(r => r.date === session.dateStr);
        if (!alreadyLogged) {
          setDetectedSession(session);
          return;
        }
      }
      setDetectedSession(null);
    } catch (e) {
      console.error('Failed to check detected session', e);
    }
  }, [records, settings]);

  const loadData = async () => {
    try {
      const storedRecords = await getSleepRecords();
      const storedSettings = await getSettings();
      const storedProfile = await getUserProfile();
      const onboardedStatus = await getHasOnboarded();

      setRecords(storedRecords);
      setSettings(storedSettings);
      setUserProfile(storedProfile);
      setHasOnboardedState(onboardedStatus);
      await checkDetected(storedRecords, storedSettings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initScreenLockTracker();
    loadData();
  }, []);

  const addRecord = async (record) => {
    const updatedRecords = await saveSleepRecord(record);
    setRecords(updatedRecords);
    if (detectedSession && detectedSession.dateStr === record.date) {
      await dismissDetectedSession(detectedSession.sessionId);
      setDetectedSession(null);
    }
  };

  const removeRecord = async (id) => {
    const updatedRecords = await deleteSleepRecord(id);
    setRecords(updatedRecords);
  };

  const updateSettings = async (newSettings) => {
    const updated = await saveSettings({ ...settings, ...newSettings });
    setSettings(updated);
    if (newSettings.screenLockTrackingEnabled === false) {
      setDetectedSession(null);
    } else if (newSettings.screenLockTrackingEnabled === true) {
      await checkDetected(records, updated);
    }
  };

  const completeOnboarding = async (profile) => {
    await saveUserProfile(profile);
    await setHasOnboarded(true);
    setUserProfile(profile);
    setHasOnboardedState(true);
  };

  const updateProfile = async (newProfileData) => {
    const merged = { ...userProfile, ...newProfileData };
    const saved = await saveUserProfile(merged);
    setUserProfile(saved);
  };

  const dismissSession = async (sessionId) => {
    await dismissDetectedSession(sessionId);
    setDetectedSession(null);
  };

  const resetData = async () => {
    await clearAllData();
    await clearDetectedSession();
    await loadData();
  };

  return (
    <SleepContext.Provider value={{
      records,
      settings,
      userProfile,
      hasOnboarded,
      loading,
      detectedSession,
      checkDetectedSession: checkDetected,
      dismissSession,
      addRecord,
      removeRecord,
      updateSettings,
      updateProfile,
      completeOnboarding,
      resetData
    }}>
      {children}
    </SleepContext.Provider>
  );
};
