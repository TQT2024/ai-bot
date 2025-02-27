import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

type UserState = {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updatedUser: Partial<Omit<User, 'id'>>) => void;
  deleteUser: (id: string) => void;
};

export const useUserStore = create<UserState, [['zustand/persist', UserState]]>(
  persist(
    (set, get) => ({
      users: [],
      addUser: (user) => {
        const newUser: User = {
          id: Date.now().toString(),
          ...user,
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },
      updateUser: (id, updatedUser) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updatedUser } : user
          ),
        }));
      },
      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
