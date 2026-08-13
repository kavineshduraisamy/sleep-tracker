import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth,
  addMonths,
  subMonths
} from 'date-fns';

export const getCalendarDays = (currentDate) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  // Get the start of the week for the month start (e.g., Sunday or Monday based on locale)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  return eachDayOfInterval({
    start: startDate,
    end: endDate
  });
};

export const getNextMonth = (date) => addMonths(date, 1);
export const getPrevMonth = (date) => subMonths(date, 1);
export const formatMonthYear = (date) => format(date, 'MMMM yyyy');

export const isCurrentMonth = (date, currentMonthDate) => {
  return isSameMonth(date, currentMonthDate);
};
