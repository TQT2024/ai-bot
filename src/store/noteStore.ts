import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Note = {
  id: string;
  title: string;
  content: string;
  notes: string;
  timestamp: number;
};

const NOTES_STORAGE_KEY = 'NOTES_STORAGE_KEY';

type NoteStore = {
  notes: Note[];
  addNote: (newNote: Note) => void;
  updateNote: (updatedNote: Note) => void;
  loadNotes: () => void;
};

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  addNote: (newNote) =>
    set((state) => {
      const updatedNotes = [newNote, ...state.notes].slice(0, 10);
      AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
      return { notes: updatedNotes };
    }),
  updateNote: (updatedNote) =>
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      );
      AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
      return { notes: updatedNotes };
    }),
  loadNotes: async () => {
    const storedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    if (storedNotes) {
      set({ notes: JSON.parse(storedNotes) });
    }
  },
  
}));
