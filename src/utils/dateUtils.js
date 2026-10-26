import { format, parseISO, isSameDay, subDays, isValid } from 'date-fns';

/**
 * Format a date string to a displayable string
 * @param {string} dateStr - ISO date string
 * @param {string} formatStr - date-fns format string
 * @returns {string} Formatted date
 */
export const formatDate = (dateStr, formatStr = 'EEEE, MMMM do') => {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (!isValid(date)) return '';
  return format(date, formatStr);
};

/**
 * Parse an ISO string into a Date object
 * @param {string} dateStr 
 * @returns {Date|null}
 */
export const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const date = parseISO(dateStr);
  return isValid(date) ? date : null;
};

/**
 * Check if two dates are the same day
 */
export const isSameDate = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(d1, d2);
};

export const getTodayStr = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getYesterdayStr = (date = new Date()) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(subDays(d, 1), 'yyyy-MM-dd');
};
