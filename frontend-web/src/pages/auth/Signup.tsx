import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import { signUp } from '@/features/auth/services/authService';

export default function Signup() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', organization: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      try {
        signUp(form.email, form.password, form.name, form.organization);
        navigate('/workspace');
      } catch (submitError) {
        setError((submitError as Error).message);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center p-4 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-md p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-24 bg-transparent dark:bg-white/95 rounded-md flex items-center justify-center mb-4">
            <img src="/logomain.png" alt="BIS-SATHI" className="h-full w-auto object-contain mix-blend-multiply dark:mix-blend-normal" />
          </div>
          <h1 className="text-headline-lg text-on-surface text-center tracking-tight mb-2">{t('auth.signup')}</h1>
          <p className="text-body-md text-on-surface-variant text-center">Join BIS-SATHI compliance platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p role="alert" className="rounded-lg bg-error-container px-3 py-2 text-[13px] text-on-error-container">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-on-surface">{t('auth.full_name')}</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-secondary transition-colors"
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-on-surface">{t('auth.organization')}</label>
              <input
                type="text"
                required
                value={form.organization}
                onChange={e => setForm(prev => ({ ...prev, organization: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-secondary transition-colors"
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-on-surface">{t('auth.email')}</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-secondary transition-colors"
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-on-surface">{t('auth.password')}</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-secondary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center py-2.5 rounded-xl bg-primary text-on-primary font-semibold transition-colors hover:bg-primary-container disabled:opacity-70"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> : t('auth.signup')}
          </button>
        </form>

        <p className="text-center text-[13px] text-on-surface-variant mt-6">
          {t('auth.have_account')} <Link to="/login" className="text-secondary font-semibold hover:underline">{t('auth.login')}</Link>
        </p>
      </motion.div>
    </div>
  );
}
