/**
 * auth.store.ts — Zustand authentication state slice
 *
 * Stores the in-memory access token and user profile.
 * The refresh token lives exclusively in an HttpOnly cookie (server-managed).
 */
import { create } from "zustand";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
  };
}

interface AuthState {
  /** In-memory access token (never persisted to localStorage). */
  accessToken: string | null;
  /** Authenticated user profile, or null when logged out. */
  user: AuthUser | null;
  /** True while a silent token refresh is in-flight. */
  isRefreshing: boolean;
  /** True after the initial auth check has completed. */
  isInitialized: boolean;

  // Actions
  setTokens: (accessToken: string, user: AuthUser) => void;
  setAccessToken: (token: string) => void;
  setIsRefreshing: (v: boolean) => void;
  setInitialized: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isRefreshing: false,
  isInitialized: false,

  setTokens: (accessToken, user) => set({ accessToken, user }),
  setAccessToken: (token) => set({ accessToken: token }),
  setIsRefreshing: (v) => set({ isRefreshing: v }),
  setInitialized: () => set({ isInitialized: true }),
  logout: () => set({ accessToken: null, user: null }),
}));
