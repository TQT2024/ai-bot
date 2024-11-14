import { useMemo } from 'react';
import useCalendarStore from '../store/calendarStore';

export const useCalendarEvents = (date: Date) => {
  const events = useCalendarStore((state) => state.events);
  
  const eventsForDate = useMemo(() => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter((event) => {
      const eventStart = event.startDate.split('T')[0];
      const eventEnd = event.endDate.split('T')[0];
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  }, [events, date]);

  return eventsForDate;
};