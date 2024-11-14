export interface CalendarEvent {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    isAllDay: boolean;
    location?: string;
    description?: string;
    notification?: string;
    type: 'event' | 'class' | 'reminder';
    color?: string;
    recurrence?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      endDate?: string;
      daysOfWeek?: number[];
    };
    timestamp: number;
  }