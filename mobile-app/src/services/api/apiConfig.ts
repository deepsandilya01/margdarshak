export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || '',
  timeoutMs: 10000,
};

let authToken: string | null = null;
export function getAuthToken(): string | null {
  return authToken;
}
export function setAuthToken(token: string | null) {
  authToken = token;
}