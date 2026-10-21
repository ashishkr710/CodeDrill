/**
 * auth.service.ts — Frontend authentication API layer.
 *
 * Wraps all /auth endpoints. Uses raw fetch for auth calls
 * (avoiding the axios interceptor circular dependency) and the
 * standard apiClient for everything else.
 */

const BASE = "/api/v1/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    role: "user" | "admin";
    streak: {
      currentStreak: number;
      longestStreak: number;
      lastActiveDate: string | null;
    };
  };
}

async function parseJson<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    const message = json?.message ?? `Request failed: ${res.status}`;
    throw new Error(message);
  }
  // API wraps data in { success, message, data }
  return json.data as T;
}

export const authApiService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return parseJson<AuthResponse>(res);
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await fetch(`${BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return parseJson<AuthResponse>(res);
  },

  /** Silently refreshes the access token using the HttpOnly refresh cookie. */
  async refresh(): Promise<{ accessToken: string }> {
    const res = await fetch(`${BASE}/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return parseJson<{ accessToken: string }>(res);
  },

  async logout(): Promise<void> {
    await fetch(`${BASE}/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  async getMe(accessToken: string): Promise<AuthResponse["user"]> {
    const res = await fetch(`${BASE}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });
    return parseJson<AuthResponse["user"]>(res);
  },
};
