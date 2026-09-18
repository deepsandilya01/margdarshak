import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signup(name, email, password);
      navigate('/workspace', { replace: true });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setGoogleLoading(true);
    
    try {
      await loginWithGoogle();
      navigate('/workspace', { replace: true });
    } catch (err) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-on-surface tracking-tight mb-2">Create account</h1>
        <p className="text-[14px] text-on-surface-variant">Get started with your private workspace</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-[13px] text-error flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-on-surface">Full name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-[14px]"
            placeholder="First and last name"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-on-surface">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-[14px]"
            placeholder="name@organization.gov.in"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-on-surface">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-[14px]"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          disabled={loading || googleLoading}
          className="w-full mt-2 flex items-center justify-center py-3 rounded-lg bg-primary text-on-primary font-semibold text-[14px] transition-colors hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex-1 h-[1px] bg-outline-variant/50"></div>
        <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">Or continue with</span>
        <div className="flex-1 h-[1px] bg-outline-variant/50"></div>
      </div>

      <button 
        type="button"
        onClick={handleGoogleSignup}
        disabled={loading || googleLoading}
        className="w-full mt-6 flex items-center justify-center gap-3 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface font-medium text-[14px] transition-colors hover:bg-surface-container-low disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </>
        )}
      </button>

      <p className="text-center text-[13px] text-on-surface-variant mt-8">
        Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
