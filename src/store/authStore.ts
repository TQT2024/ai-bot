import { create } from 'zustand';

type AuthState = {
  isLoggedIn: boolean;
  role: "admin" | "user" | null;
  userId: string | null;
  login: (role: 'user' | 'admin', userId: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  role: null,
  userId: null,
  login: (role, userId) => set({ isLoggedIn: true, role, userId }),
  logout: () => set({ isLoggedIn: false, role: null, userId: null }),
}));
