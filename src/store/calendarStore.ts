import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { auth, db } from '../../firebaseconfig';
import { CalendarEvent } from '../types/calendar';

interface CalendarStore {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  clearEvents: () => void;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (event: CalendarEvent) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  getEventsByDateRange: (startDate: Date, endDate: Date) => CalendarEvent[];
  getEventsByType: (type: CalendarEvent['type']) => CalendarEvent[];
}

const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,
  clearEvents: () => set({ events: [], isLoading: false, error: null }),
  
  // Tải các sự kiện của người dùng hiện tại
  fetchEvents: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    set({ isLoading: true, error: null });
    try {
      const q = query(
        collection(db, 'events'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const events: CalendarEvent[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as CalendarEvent[];
      set({ events, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error fetching events', 
        isLoading: false 
      });
    }
  },

  // Thêm sự kiện mới cho người dùng hiện tại
  addEvent: async (eventData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    
    set({ isLoading: true, error: null });
    try {
      const newEvent = {
        ...eventData,
        userId,
        // Ví dụ: gán màu cho sự kiện dựa trên type
        color: eventData.type === 'event' ? '#FFA500' : '#2196F3'
      };
      const docRef = await addDoc(collection(db, 'events'), newEvent);
      set((state) => ({
        events: [...state.events, { id: docRef.id, ...newEvent }],
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error adding event', 
        isLoading: false 
      });
    }
  },

  // Cập nhật sự kiện (chỉ cho phép cập nhật nếu sự kiện thuộc về người dùng hiện tại)
  updateEvent: async (updatedEvent) => {
    const currentUserId = auth.currentUser?.uid;
    if (updatedEvent.userId !== currentUserId) {
      console.error('Bạn không có quyền cập nhật sự kiện của người khác!');
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const { id, ...eventData } = updatedEvent;
      await updateDoc(doc(db, 'events', id), eventData);
      set((state) => ({
        events: state.events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error updating event', 
        isLoading: false 
      });
    }
  },

  // Xoá sự kiện (chỉ cho phép xoá nếu sự kiện thuộc về người dùng hiện tại)
  deleteEvent: async (eventId) => {
    const currentUserId = auth.currentUser?.uid;
    const eventToDelete = get().events.find((event) => event.id === eventId);
    if (!eventToDelete) {
      console.error('Không tìm thấy sự kiện!');
      return;
    }
    if (eventToDelete.userId !== currentUserId) {
      console.error('Bạn không có quyền xóa sự kiện của người khác!');
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      await deleteDoc(doc(db, 'events', eventId));
      set((state) => ({
        events: state.events.filter((event) => event.id !== eventId),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error deleting event', 
        isLoading: false 
      });
    }
  },

  // Lọc sự kiện theo khoảng thời gian
  getEventsByDateRange: (startDate, endDate) => {
    return get().events.filter((event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return eventStart >= startDate && eventEnd <= endDate;
    });
  },

  // Lọc sự kiện theo loại
  getEventsByType: (type) => {
    return get().events.filter((event) => event.type === type);
  },
}));

export default useCalendarStore;
