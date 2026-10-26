import { AppState, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, differenceInMinutes, subDays } from 'date-fns';

const { ScreenLockModule } = NativeModules;

const STORAGE_KEYS = {
  LAST_LOCK: '@sleep_last_lock_timestamp',
  LAST_UNLOCK: '@sleep_last_unlock_timestamp',
  DISMISSED_SESSION: '@sleep_dismissed_session_id',
};

let appStateSubscription = null;

/**
 * Initialize background / lock tracking in JavaScript
 */
export const initScreenLockTracker = () => {
  if (appStateSubscription) return;

  appStateSubscription = AppState.addEventListener('change', async (nextState) => {
    const now = Date.now();

    if (nextState === 'background' || nextState === 'inactive') {
      // Phone locked or app backgrounded
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOCK, now.toString());
      } catch (err) {
        console.error('Error recording screen lock:', err);
      }
    } else if (nextState === 'active') {
      // Phone unlocked or app foregrounded
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_UNLOCK, now.toString());
      } catch (err) {
        console.error('Error recording screen unlock:', err);
      }
    }
  });
};

/**
 * Get automatically detected sleep session based on screen lock/unlock timings
 */
export const getDetectedSleepSession = async () => {
  try {
    let lockTimestamp = 0;
    let unlockTimestamp = 0;
    let source = 'appstate';

    // 1. Try native Android module if available
    if (ScreenLockModule && typeof ScreenLockModule.getScreenLockSession === 'function') {
      try {
        const nativeSession = await ScreenLockModule.getScreenLockSession();
        if (nativeSession && nativeSession.lastScreenOff > 0 && nativeSession.lastScreenUnlock > nativeSession.lastScreenOff) {
          lockTimestamp = nativeSession.lastScreenOff;
          unlockTimestamp = nativeSession.lastScreenUnlock;
          source = 'screen_hardware';
        }
      } catch (nativeErr) {
        // Fall back to AsyncStorage
      }
    }

    // 2. If native did not return a session, use AsyncStorage timestamps
    if (!lockTimestamp || !unlockTimestamp) {
      const storedLock = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOCK);
      const storedUnlock = await AsyncStorage.getItem(STORAGE_KEYS.LAST_UNLOCK);

      if (storedLock && storedUnlock) {
        lockTimestamp = parseInt(storedLock, 10);
        unlockTimestamp = parseInt(storedUnlock, 10);
      }
    }

    if (!lockTimestamp || !unlockTimestamp || unlockTimestamp <= lockTimestamp) {
      return { hasSession: false };
    }

    const bedtime = new Date(lockTimestamp);
    const wakeTime = new Date(unlockTimestamp);
    const durationMinutes = differenceInMinutes(wakeTime, bedtime);

    // Filter valid sleep sessions: between 45 minutes and 18 hours
    if (durationMinutes < 45 || durationMinutes > 18 * 60) {
      return { hasSession: false };
    }

    // Check if user already dismissed this exact session
    const sessionId = `${lockTimestamp}_${unlockTimestamp}`;
    const dismissedId = await AsyncStorage.getItem(STORAGE_KEYS.DISMISSED_SESSION);
    if (dismissedId === sessionId) {
      return { hasSession: false };
    }

    // Determine the sleep date (if bedtime was past midnight or early morning, attribute appropriately)
    const dateStr = format(bedtime.getHours() < 6 ? subDays(bedtime, 1) : bedtime, 'yyyy-MM-dd');

    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    const formattedDuration = `${hours}h ${mins}m`;

    return {
      hasSession: true,
      sessionId,
      bedtime,
      wakeTime,
      durationMinutes,
      formattedBedtime: format(bedtime, 'h:mm a'),
      formattedWakeTime: format(wakeTime, 'h:mm a'),
      formattedDuration,
      dateStr,
      source
    };
  } catch (error) {
    console.error('Error checking detected sleep session:', error);
    return { hasSession: false };
  }
};

/**
 * Dismiss the current detected session so it won't prompt again
 */
export const dismissDetectedSession = async (sessionId) => {
  try {
    if (sessionId) {
      await AsyncStorage.setItem(STORAGE_KEYS.DISMISSED_SESSION, sessionId);
    }
  } catch (error) {
    console.error('Error dismissing session:', error);
  }
};

/**
 * Clear tracking history
 */
export const clearDetectedSession = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.LAST_LOCK);
    await AsyncStorage.removeItem(STORAGE_KEYS.LAST_UNLOCK);
    await AsyncStorage.removeItem(STORAGE_KEYS.DISMISSED_SESSION);

    if (ScreenLockModule && typeof ScreenLockModule.clearScreenLockSession === 'function') {
      await ScreenLockModule.clearScreenLockSession();
    }
  } catch (error) {
    console.error('Error clearing session data:', error);
  }
};
