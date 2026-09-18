import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useLanguageContext } from '@/context/LanguageContext';
import { LANGUAGES, type LanguageCode } from '@/core/apiConfig';
import { useAuth } from '@/context/AuthContext';
import { useT as useTranslation } from '@/hooks/useTranslation';

// ─── Extracted sub-components ──

interface ThemeSwitcherProps {
  theme: string;
  setTheme: (t: 'light' | 'dark' | 'system') => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

function ThemeSwitcher({ theme, setTheme, dropdownRef }: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container-low text-on-surface-variant transition-colors hover:border-primary/30 hover:bg-surface-container hover:text-on-surface"
        aria-label="Theme Settings"
      >
        <span className="material-symbols-outlined text-[20px]">
          {theme === 'light' ? 'light_mode' : theme === 'dark' ? 'dark_mode' : 'contrast'}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest py-1 shadow-lg z-[60]">
          {(['light', 'dark', 'system'] as const).map(opt => (
            <button
              key={opt}
              onClick={() => { setTheme(opt); setOpen(false); }}
              className={`flex w-full items-center justify-between px-4 py-2 text-left text-[13px] font-medium transition-colors ${theme === opt ? 'bg-surface-container-low text-primary' : 'text-on-surface hover:bg-surface-container-low'}`}
            >
              <span className="capitalize">{opt}</span>
              {theme === opt && <span className="material-symbols-outlined text-[16px]">check</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface LangSwitcherProps {
  currentLang: typeof LANGUAGES[number];
  currentCode: string;
  setLanguage: (lang: LanguageCode) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

function LangSwitcher({ currentLang, currentCode, setLanguage, dropdownRef }: LangSwitcherProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-xl border border-outline-variant/50 bg-surface-container-low px-3 py-2 text-on-surface-variant transition-colors hover:border-primary/30 hover:bg-surface-container hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-[18px]">translate</span>
        <div className="flex flex-col items-start leading-none gap-0.5">
          <span className="text-[12px] font-bold text-on-surface leading-none">{currentLang.nativeName}</span>
        </div>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 max-h-[60vh] overflow-y-auto rounded-xl border border-outline-variant/40 bg-surface-container-lowest py-2 shadow-lg z-[60]">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={`flex w-full items-center justify-between px-4 py-2 text-left transition-colors ${currentCode === lang.code ? 'bg-surface-container-low border-l-2 border-primary' : 'border-l-2 border-transparent text-on-surface hover:bg-surface-container-low'}`}
            >
              <div className="flex flex-col gap-0.5">
                <span className={`text-[14px] font-semibold ${currentCode === lang.code ? 'text-primary' : 'text-on-surface'}`}>{lang.nativeName}</span>
                <span className="text-[11px] text-on-surface-variant">{lang.englishName}</span>
              </div>
              {currentCode === lang.code && <span className="material-symbols-outlined text-[18px] text-primary">check</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────

export default function Header() {
  const { language, setLanguage } = useLanguageContext();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const { t } = useTranslation(['common']);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <>
      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-surface overflow-y-auto lg:hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/40">
            <Link to="/" className="h-9 flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <img src="/logo.png" alt="BIS-SATHI" className="h-12 w-auto object-contain" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/40 text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link to="/" className="block w-full py-3 text-[16px] font-medium text-on-surface" onClick={() => setMobileMenuOpen(false)}>{t('header.home')}</Link>
            <a href="/#how-it-works" className="block w-full py-3 text-[16px] font-medium text-on-surface" onClick={() => setMobileMenuOpen(false)}>{t('header.howItWorks')}</a>
            <Link to="/about" className="block w-full py-3 text-[16px] font-medium text-on-surface" onClick={() => setMobileMenuOpen(false)}>{t('header.about')}</Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block w-full py-3 text-[16px] font-medium text-on-surface" onClick={() => setMobileMenuOpen(false)}>{t('header.login')}</Link>
                <Link to="/signup" className="block w-full py-3 text-[16px] font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>{t('header.signup')}</Link>
              </>
            ) : (
              <Link to="/workspace" className="block w-full py-3 text-[16px] font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>Workspace</Link>
            )}
          </nav>
        </div>
      )}

      <header
        className={`sticky top-0 z-[60] w-full transition-all duration-300 backdrop-blur-xl ${
          isScrolled
            ? 'bg-surface/85 shadow-sm border-b border-outline-variant/60'
            : 'bg-surface/90 border-b border-outline-variant/50'
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link to="/" className="relative flex h-full shrink-0 items-center gap-3 py-2 group">
            <img src="/logo.png" alt="BIS-SATHI" className="h-[48px] w-auto object-contain" />
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 mr-4">
              <Link to="/" className="text-[14px] font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                {t('header.home')}
              </Link>
              <a href="/#how-it-works" className="text-[14px] font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                {t('header.howItWorks')}
              </a>
              <Link to="/about" className="text-[14px] font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                {t('header.about')}
              </Link>
            </nav>

            <div className="hidden lg:block">
              <LangSwitcher currentLang={currentLang} currentCode={language} setLanguage={setLanguage} dropdownRef={langDropdownRef} />
            </div>

            <div className="hidden lg:block">
              <ThemeSwitcher theme={theme} setTheme={setTheme} dropdownRef={themeDropdownRef} />
            </div>

            <div className="hidden lg:block w-[1px] h-6 bg-outline-variant/50 mx-2"></div>

            {/* Auth Actions */}
            {!isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl border border-outline-variant/50 text-[14px] font-medium text-on-surface transition-colors hover:bg-surface-container-low"
                >
                  {t('header.login')}
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-[14px] font-semibold hover:brightness-110 transition-colors shadow-sm"
                >
                  {t('header.signup')}
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/workspace"
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-[14px] font-semibold hover:brightness-110 transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>Workspace</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/50 text-on-surface-variant lg:hidden"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
          </div>
        </div>
        
        {/* Tricolor Bar */}
        <div className="h-1.5 w-full tricolor-bar opacity-80"></div>
      </header>
    </>
  );
}
