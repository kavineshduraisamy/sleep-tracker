import React, { createContext, useState, useEffect } from 'react';
import { 
  getSleepRecords, 
  saveSleepRecord, 
  deleteSleepRecord,
  getSettings,
  saveSettings,
  clearAllData
} from '../services/storage';

export const SleepContext = createContext();

export const SleepProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const storedRecords = await getSleepRecords();
      const storedSettings = await getSettings();
      setRecords(storedRecords);
      setSettings(storedSettings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addRecord = async (record) => {
    const updatedRecords = await saveSleepRecord(record);
    setRecords(updatedRecords);
  };

  const removeRecord = async (id) => {
    const updatedRecords = await deleteSleepRecord(id);
    setRecords(updatedRecords);
  };

  const updateSettings = async (newSettings) => {
    const updated = await saveSettings({ ...settings, ...newSettings });
    setSettings(updated);
  };

  const resetData = async () => {
    await clearAllData();
    await loadData();
  };

  return (
    <SleepContext.Provider value={{
      records,
      settings,
      loading,
      addRecord,
      removeRecord,
      updateSettings,
      resetData
    }}>
      {children}
    </SleepContext.Provider>
  );
};
