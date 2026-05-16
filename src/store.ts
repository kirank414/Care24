import { create } from 'zustand';
import { User, UserRole } from './types';

interface AuthState {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Helper to safely parse localStorage in browser environment
const getInitialState = () => {
  if (typeof window === 'undefined') return { user: null, token: null, role: null, isAuthenticated: false };
  try {
    const token = localStorage.getItem('care24_token');
    const userStr = localStorage.getItem('care24_user');
    if (token && userStr) {
      const user: User = JSON.parse(userStr);
      return { user, token, role: user.role, isAuthenticated: true };
    }
  } catch (error) {
    console.error("Failed to parse auth state from localStorage", error);
  }
  return { user: null, token: null, role: null, isAuthenticated: false };
};

const initialState = getInitialState();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialState.user,
  token: initialState.token,
  role: initialState.role,
  isAuthenticated: initialState.isAuthenticated,
  login: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('care24_token', token);
      localStorage.setItem('care24_user', JSON.stringify(user));
    }
    set({ user, token, role: user.role, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('care24_token');
      localStorage.removeItem('care24_user');
    }
    set({ user: null, token: null, role: null, isAuthenticated: false });
  },
}));
