import { differenceInMinutes, parse, format, addDays } from 'date-fns';

/**
 * Calculate sleep duration in minutes correctly handling overnight sleep.
 * @param {Date|string} bedTime 
 * @param {Date|string} wakeTime 
 * @returns {number} Duration in minutes
 */
export const calculateSleepDuration = (bedTime, wakeTime) => {
  if (!bedTime || !wakeTime) return 0;
  
  // If inputs are strings like "23:00", parse them to Date objects for today
  let bedDate = bedTime;
  let wakeDate = wakeTime;
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  if (typeof bedTime === 'string') {
    // Assuming format "HH:mm"
    bedDate = parse(`${today} ${bedTime}`, 'yyyy-MM-dd HH:mm', new Date());
  }
  
  if (typeof wakeTime === 'string') {
    wakeDate = parse(`${today} ${wakeTime}`, 'yyyy-MM-dd HH:mm', new Date());
  }
  
  // If wake time is before bedtime, it means they slept overnight
  if (wakeDate < bedDate) {
    wakeDate = addDays(wakeDate, 1);
  }
  
  const diff = differenceInMinutes(wakeDate, bedDate);
  return diff > 0 ? diff : 0;
};

/**
 * Format minutes into "Xh Ym" string
 * @param {number} minutes 
 * @returns {string} 
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
};

/**
 * Calculate goal completion status
 * @param {number} durationMinutes 
 * @param {number} goalMinutes 
 * @returns {boolean}
 */
export const isGoalAchieved = (durationMinutes, goalMinutes) => {
  return durationMinutes >= goalMinutes;
};

/**
 * Calculate average sleep from a list of records
 * @param {Array} records 
 * @returns {number} Average duration in minutes
 */
export const calculateAverageSleep = (records) => {
  if (!records || records.length === 0) return 0;
  const total = records.reduce((sum, record) => sum + (record.durationMinutes || 0), 0);
  return Math.round(total / records.length);
};

export const getWeeklySleepData = (records) => {
  // Sort descending by date
  const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted.slice(0, 7);
};
