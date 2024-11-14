import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CalendarEvent } from '../types/calendar';

interface CalendarStore {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  timestamp: number;
  
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (event: CalendarEvent) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  getEventsByDateRange: (startDate: Date, endDate: Date) => CalendarEvent[];
  getEventsByType: (type: CalendarEvent['type']) => CalendarEvent[];
}

const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
        events: [],
        isLoading: false,
        error: null,
        timestamp: Date.now(),

        addEvent: async (eventData) => {
            try {
            set({ isLoading: true, error: null });
            const newEvent: CalendarEvent = {
                ...eventData,
                id: Date.now().toString(),
            };

            set((state) => ({
                events: [...state.events, newEvent],
                isLoading: false,
            }));
            } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set({ error: errorMessage, isLoading: false });
            }
        },

      updateEvent: async (updatedEvent) => {
        try {
          set({ isLoading: true, error: null });
          set((state) => ({
            events: state.events.map((event) =>
              event.id === updatedEvent.id ? updatedEvent : event
            ),
            isLoading: false,
          }));
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
        }
      },

      deleteEvent: async (eventId) => {
        try {
          set({ isLoading: true, error: null });
          set((state) => ({
            events: state.events.filter((event) => event.id !== eventId),
            isLoading: false,
          }));
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
        }
      },

      

      getEventsByDateRange: (startDate, endDate) => {
        const { events } = get();
        return events.filter((event) => {
          const eventStart = new Date(event.startDate);
          const eventEnd = new Date(event.endDate);
          return eventStart >= startDate && eventEnd <= endDate;
        });
      },

      getEventsByType: (type) => {
        const { events } = get();
        return events.filter((event) => event.type === type);
      },
    }),
    {
      name: 'calendar-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ events: state.events }),
    }
  )
);

export default useCalendarStore;
  