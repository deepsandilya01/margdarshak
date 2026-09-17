export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  timeoutMs: 10000,
};

export function getAuthToken(): string | null {
  return localStorage.getItem('bis-sathi-auth-token');
}