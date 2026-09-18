import { apiClient, ApiError } from '@/services/api/apiClient';

const TOKEN_KEY = 'bis-sathi-auth-token';
const REFRESH_KEY = 'bis-sathi-refresh-token';
const SESSION_KEY = 'bis-sathi-auth-session';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  preferredLanguage?: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthPayload {
  user: AuthUser;
  token: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * Register a new user via Primary Server.
 * POST /api/v1/auth/register
 */
export async function signUp(name: string, email: string, password: string): Promise<AuthUser> {
  const res = await apiClient.post<ApiEnvelope<AuthPayload>>('/auth/register', { name, email, password });
  const { user, accessToken, refreshToken } = res.data;

  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

  return user;
}

/**
 * Login via Primary Server.
 * POST /api/v1/auth/login
 */
export async function signIn(email: string, password: string): Promise<AuthUser> {
  const res = await apiClient.post<ApiEnvelope<AuthPayload>>('/auth/login', { email, password });
  const { user, accessToken, refreshToken } = res.data;

  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));

  return user;
}

/**
 * Logout via Primary Server.
 * POST /api/v1/auth/logout
 */
export async function signOut(): Promise<void> {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  try {
    await apiClient.post('/auth/logout', { refreshToken });
  } catch {
    // Best effort — clear local state regardless
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Get the currently stored user from localStorage (for session restoration).
 */
export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) as AuthUser : null;
  } catch {
    return null;
  }
}

/**
 * Validate the stored token by calling GET /api/v1/auth/me.
 * Returns the fresh user object or null if the token is invalid.
 */
export async function validateSession(): Promise<AuthUser | null> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const res = await apiClient.get<ApiEnvelope<{ user: AuthUser }>>('/auth/me');
    const user = res.data.user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      // Token expired — try refresh
      return tryRefreshToken();
    }
    return null;
  }
}

async function tryRefreshToken(): Promise<AuthUser | null> {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) {
    clearSession();
    return null;
  }

  try {
    const res = await apiClient.post<ApiEnvelope<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken });
    localStorage.setItem(TOKEN_KEY, res.data.accessToken);
    localStorage.setItem(REFRESH_KEY, res.data.refreshToken);
    // Re-validate with the new token
    const meRes = await apiClient.get<ApiEnvelope<{ user: AuthUser }>>('/auth/me');
    const user = meRes.data.user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  } catch {
    clearSession();
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(SESSION_KEY);
}