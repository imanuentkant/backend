'use client';

import { create } from 'zustand';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getMe } from '../api/auth';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (params: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const response = await apiLogin({ email, password });
    set({
      user: response.data.user,
      token: response.data.accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  register: async (params) => {
    await apiRegister(params);
    // After register, auto login
    await useAuth.getState().login(params.email, params.password);
  },

  logout: () => {
    apiLogout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    try {
      const response = await getMe();
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
