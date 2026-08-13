import { parseISO, differenceInDays, startOfDay } from 'date-fns';
import { getTodayStr, getYesterdayStr } from './dateUtils';

/**
 * Clean and sort records chronologically, returning unique dates.
 */
const getUniqueSortedDates = (records) => {
  if (!records || records.length === 0) return [];
  
  // Extract just the dates and remove duplicates
  const uniqueDateStrings = [...new Set(records.map(r => r.date))];
  
  // Parse and sort oldest to newest
  return uniqueDateStrings
    .map(dateStr => parseISO(dateStr))
    .sort((a, b) => a - b);
};

export const calculateCurrentStreak = (records) => {
  if (!records || records.length === 0) return 0;
  
  const sortedDates = getUniqueSortedDates(records).reverse(); // Newest to oldest
  
  const today = startOfDay(parseISO(getTodayStr()));
  const yesterday = startOfDay(parseISO(getYesterdayStr()));
  
  let currentStreak = 0;
  let expectedDate = today;
  
  // Check if today or yesterday is the start of the streak
  const mostRecentRecordDate = sortedDates[0];
  const daysDiff = differenceInDays(today, mostRecentRecordDate);
  
  if (daysDiff > 1) {
    // Streak broken (last record was before yesterday)
    return 0;
  }
  
  if (daysDiff === 1) {
    // Streak is alive but today hasn't been logged yet
    expectedDate = yesterday;
  }
  
  for (const date of sortedDates) {
    if (differenceInDays(expectedDate, date) === 0) {
      currentStreak++;
      expectedDate = parseISO(getYesterdayStr(expectedDate)); // Move expected date back by 1 day manually
      // Actually, easier way to subtract days:
      expectedDate = new Date(expectedDate.getTime() - 24 * 60 * 60 * 1000);
    } else {
      break; // Streak broken
    }
  }
  
  return currentStreak;
};

export const calculateLongestStreak = (records) => {
  if (!records || records.length === 0) return 0;
  
  const sortedDates = getUniqueSortedDates(records); // Oldest to newest
  
  let longestStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = sortedDates[i - 1];
    const currDate = sortedDates[i];
    
    if (differenceInDays(currDate, prevDate) === 1) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 1;
    }
  }
  
  return longestStreak;
};
