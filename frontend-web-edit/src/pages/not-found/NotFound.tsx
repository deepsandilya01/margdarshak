import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-[1440px] mx-auto px-8 py-24 flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-3xl bg-surface-container-high flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[48px] text-on-surface-variant">find_in_page</span>
      </div>
      <div className="font-mono text-[72px] font-bold text-[#e2e7ff] leading-none mb-3 select-none">404</div>
      <h1 className="text-headline-lg text-primary mb-2">{t('404.title')}</h1>
      <p className="text-body-md text-on-surface-variant max-w-sm mb-6">{t('404.subtitle')}</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-[16px] font-semibold hover:bg-primary-container transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">home</span>
        {t('404.cta')}
      </Link>
    </div>
  );
}
