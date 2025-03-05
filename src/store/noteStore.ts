import { create } from 'zustand';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseconfig';

export type Note = {
  id: string;
  title: string;
  content: string;
  notes: string;
  timestamp: number;
  userId: string;
};

const NOTES_COLLECTION = 'notes';

type NoteStore = {
  notes: Note[];
  addNote: (noteData: Omit<Note, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  updateNote: (updatedNote: Note) => Promise<void>;
  loadNotes: () => Promise<void>;
  clearNotes: () => void;
};

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  addNote: async (noteData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error('User not logged in!');
      return;
    }
    try {
      const newNote: Note = {
        ...noteData,
        userId,
        timestamp: Date.now(),
        id: '', // Sẽ cập nhật sau khi thêm vào Firestore
      };
      const docRef = await addDoc(collection(db, NOTES_COLLECTION), newNote);
      newNote.id = docRef.id;
      set((state) => {
        // Giới hạn số lượng note nếu cần, ví dụ chỉ lưu tối đa 10 note mới nhất
        const updatedNotes = [newNote, ...state.notes].slice(0, 10);
        return { notes: updatedNotes };
      });
    } catch (error) {
      console.error('Error adding note: ', error);
    }
  },
  updateNote: async (updatedNote) => {
    try {
      const noteRef = doc(db, NOTES_COLLECTION, updatedNote.id);
      await updateDoc(noteRef, updatedNote);
      set((state) => {
        const updatedNotes = state.notes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        );
        return { notes: updatedNotes };
      });
    } catch (error) {
      console.error('Error updating note: ', error);
    }
  },
  loadNotes: async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error('User not logged in!');
      return;
    }
    try {
      const q = query(
        collection(db, NOTES_COLLECTION),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const notes = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Note[];
      set({ notes });
    } catch (error) {
      console.error('Failed to load notes from Firestore:', error);
    }
  },
  clearNotes: () => set({ notes: [] }),
}));

// Khi ứng dụng khởi động (hoặc sau khi login thành công), gọi loadNotes để tải dữ liệu của user hiện tại
const currentUserId = auth.currentUser?.uid;
if (currentUserId) {
  useNoteStore.getState().loadNotes();
}
