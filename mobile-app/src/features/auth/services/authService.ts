import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'bis-sathi-auth-session';

export interface AuthSession {
  email: string;
  displayName: string;
  organization?: string;
  token: string;
}

export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const value = await AsyncStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) as AuthSession : null;
  } catch {
    return null;
  }
}

export async function signIn(email: string, password: string): Promise<AuthSession> {
  if (!email.trim() || password.length < 6) throw new Error('Enter a valid email and a password of at least 6 characters.');
  const session = { email: email.trim(), displayName: email.split('@')[0], token: `mock-session-${Date.now()}` };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  await AsyncStorage.setItem('bis-sathi-auth-token', session.token);
  return session;
}

export async function signUp(email: string, password: string, displayName: string, organization: string): Promise<AuthSession> {
  if (!displayName.trim() || !organization.trim() || !email.trim() || password.length < 6) {
    throw new Error('Complete all fields and use a password of at least 6 characters.');
  }
  const session = { email: email.trim(), displayName: displayName.trim(), organization: organization.trim(), token: `mock-session-${Date.now()}` };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  await AsyncStorage.setItem('bis-sathi-auth-token', session.token);
  return session;
}

export async function signOut(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
  await AsyncStorage.removeItem('bis-sathi-auth-token');
}