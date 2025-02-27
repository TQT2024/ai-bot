import { create } from 'zustand';

type AuthState = {
  isLoggedIn: boolean;
  role: "admin" | "user" | null;
  login: (role: 'user' | 'admin') => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  role: null,
  login: (role) => set({ isLoggedIn: true, role }),
  logout: () => set({ isLoggedIn: false, role: null }),
}));
