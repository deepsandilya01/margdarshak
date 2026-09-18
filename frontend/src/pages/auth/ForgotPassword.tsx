import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
          <span className="material-symbols-outlined text-[32px]">mark_email_read</span>
        </div>
        <h1 className="text-[28px] font-bold text-on-surface tracking-tight mb-2">Check your email</h1>
        <p className="text-[14px] text-on-surface-variant mb-8">
          We have sent a password recovery link to <br/>
          <span className="font-semibold text-on-surface">{email}</span>
        </p>
        <Link to="/login" className="w-full flex items-center justify-center py-3 rounded-lg bg-surface-container-high text-on-surface font-semibold text-[14px] transition-colors hover:bg-surface-container-highest">
          Return to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-on-surface tracking-tight mb-2">Reset password</h1>
        <p className="text-[14px] text-on-surface-variant">Enter your email address and we'll send you a link to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

        <button 
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3 rounded-lg bg-primary text-on-primary font-semibold text-[14px] transition-colors hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
          ) : (
            'Send recovery link'
          )}
        </button>
      </form>

      <p className="text-center text-[13px] text-on-surface-variant mt-8">
        Remember your password? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
