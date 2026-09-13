const SESSION_KEY = 'bis-sathi-auth-session';

export interface AuthSession {
  email: string;
  displayName: string;
  organization?: string;
  token: string;
}

export function getAuthSession(): AuthSession | null {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) as AuthSession : null;
  } catch {
    return null;
  }
}

export function signIn(email: string, password: string): AuthSession {
  if (!email.trim() || password.length < 6) throw new Error('Enter a valid email and a password of at least 6 characters.');
  const session = { email: email.trim(), displayName: email.split('@')[0], token: `mock-session-${Date.now()}` };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem('bis-sathi-auth-token', session.token);
  return session;
}

export function signUp(email: string, password: string, displayName: string, organization: string): AuthSession {
  if (!displayName.trim() || !organization.trim() || !email.trim() || password.length < 6) {
    throw new Error('Complete all fields and use a password of at least 6 characters.');
  }
  const session = { email: email.trim(), displayName: displayName.trim(), organization: organization.trim(), token: `mock-session-${Date.now()}` };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem('bis-sathi-auth-token', session.token);
  return session;
}

export function signOut(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('bis-sathi-auth-token');
}