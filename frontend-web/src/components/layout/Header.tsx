import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '../../context/LanguageContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useTheme } from '../../context/ThemeContext';
import SearchOverlay from '../search/SearchOverlay';

export default function Header() {
  const { t, language, setLanguage } = useLanguage();
  const { savedItems } = useWorkspace();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setMobileMenuOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const navItems = [
    { key: 'nav.standards', path: '/standards', icon: 'menu_book' },
    { key: 'nav.products', path: '/discover', icon: 'radar' },
    { key: 'nav.qcos', path: '/qco', icon: 'gavel' },
    { key: 'nav.laboratories', path: '/laboratories', icon: 'science' },
    { key: 'nav.certification', path: '/certification', icon: 'verified' },
    { key: 'nav.hallmarking', path: '/hallmarking', icon: 'diamond' },
    { key: 'nav.ai_sathi', path: '/ai-sathi', icon: 'auto_awesome' },
    { key: 'nav.consumer_help', path: '/help', icon: 'support_agent' },
    { key: 'nav.resources', path: '/resources', icon: 'library_books' },
  ] as const;

  const isActive = useCallback(
    (path: string) => location.pathname.startsWith(path) && path !== '/',
    [location.pathname]
  );

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const ThemeSwitcher = ({ compact = false }: { compact?: boolean }) => (
    <div className="relative" ref={compact ? undefined : themeDropdownRef}>
      <button
        onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
        className={`flex items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container-low text-on-surface-variant transition-colors hover:border-primary/30 hover:bg-surface-container hover:text-on-surface ${compact ? 'h-10 w-10' : 'h-10 w-10'}`}
        aria-label="Theme Settings"
      >
        <span className="material-symbols-outlined text-[20px]">
          {theme === 'light' ? 'light_mode' : theme === 'dark' ? 'dark_mode' : 'contrast'}
        </span>
      </button>
      {themeDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-lowest py-1 shadow-[0_16px_32px_rgba(15,23,42,0.08)] z-[60]">
          {(['light', 'dark', 'system'] as const).map(opt => (
            <button
              key={opt}
              onClick={() => { setTheme(opt); setThemeDropdownOpen(false); }}
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

  const LangSwitcher = ({ compact = false }: { compact?: boolean }) => (
    <div className="relative" ref={compact ? undefined : langDropdownRef}>
      <button
        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
        className="flex items-center gap-1.5 rounded-xl border border-outline-variant/50 bg-surface-container-low px-2.5 py-2 text-on-surface-variant transition-colors hover:border-primary/30 hover:bg-surface-container hover:text-on-surface"
        aria-label={`Language: ${currentLang.native}`}
      >
        <span className="material-symbols-outlined text-[16px]">translate</span>
        <span className="text-[12px] font-semibold">{currentLang.code.toUpperCase()}</span>
      </button>
      {langDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 max-h-80 overflow-y-auto rounded-xl border border-outline-variant/40 bg-surface-container-lowest py-1 shadow-[0_16px_32px_rgba(15,23,42,0.08)] z-[60]">
          <div className="mb-1 border-b border-outline-variant/40 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Select Language
          </div>
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setLangDropdownOpen(false); }}
              className={`flex w-full flex-col px-4 py-2 text-left text-[13px] transition-colors ${language === lang.code ? 'bg-surface-container text-primary' : 'text-on-surface hover:bg-surface-container-low'}`}
            >
              <span className="font-semibold">{lang.native}</span>
              <span className="text-[11px] text-on-surface-variant">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Mobile Full-Screen Menu ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-surface overflow-y-auto lg:hidden">
          {/* Mobile menu header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/40">
            <Link to="/" className="h-9 flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <img src="/logo.png" alt="BIS-SATHI" className="h-40 w-50 object-contain" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/40 text-on-surface-variant"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-4 py-4 space-y-1" aria-label="Mobile navigation">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{t(item.key)}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-outline-variant/30 mt-2 space-y-1">
              <Link to="/workspace" className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-on-surface hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-[20px]">space_dashboard</span>
                <span>Compliance Workspace</span>
              </Link>
              <Link to="/saved" className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-on-surface hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-[20px]">bookmark</span>
                <span>Saved Items {savedItems.length > 0 ? `(${savedItems.length})` : ''}</span>
              </Link>
              <Link to="/history" className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-on-surface hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-[20px]">history</span>
                <span>Research History</span>
              </Link>
              <Link to="/reports" className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-on-surface hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-[20px]">description</span>
                <span>Reports</span>
              </Link>
              <Link to="/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-on-surface hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-[20px]">person</span>
                <span>Profile</span>
              </Link>
              <Link to="/settings" className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-on-surface hover:bg-surface-container-low">
                <span className="material-symbols-outlined text-[20px]">settings</span>
                <span>Settings</span>
              </Link>
            </div>
          </nav>

          {/* Language + Theme controls */}
          <div className="px-4 py-4 border-t border-outline-variant/30 flex flex-col gap-4">
            <div>
              <p className="text-[11px] text-on-surface-variant mb-2 uppercase tracking-widest font-semibold">Theme</p>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setTheme(opt)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[13px] font-medium transition-colors border ${
                      theme === opt
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container text-on-surface border-outline-variant/40 hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {opt === 'light' ? 'light_mode' : opt === 'dark' ? 'dark_mode' : 'contrast'}
                    </span>
                    <span className="capitalize">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-on-surface-variant mb-2 uppercase tracking-widest font-semibold">Language</p>
              <div className="flex flex-wrap gap-1.5">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                      language === lang.code
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Auth links */}
          <div className="px-4 pb-6 flex gap-3">
            <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl border border-outline-variant/50 text-[14px] font-medium text-on-surface hover:bg-surface-container-low transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="flex-1 text-center py-2.5 rounded-xl bg-primary text-on-primary text-[14px] font-medium hover:brightness-110 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      )}

      <header
        className={`sticky top-0 z-[60] w-full transition-all duration-300 backdrop-blur-xl ${
          isScrolled
            ? 'bg-surface/85 shadow-[0_10px_24px_rgba(15,23,42,0.06)] border-b border-outline-variant/60'
            : 'bg-surface/90 border-b border-outline-variant/50'
        }`}
      >
        {/* ── Main header bar ── */}
        <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-5 lg:px-8">
          {/* Logo */}
          <Link to="/" className="relative flex h-full shrink-0 items-center gap-3 rounded-xl py-2 outline-none ring-offset-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary group">
            <div className="absolute inset-x-2 inset-y-1.5 rounded-full bg-gradient-to-r from-secondary/10 via-primary/10 to-primary-container/20 blur-lg opacity-80 group-hover:opacity-100 transition-opacity duration-400" />
            <div className="relative flex h-full items-center justify-center transition-all duration-300 group-hover:scale-[1.06]">
              <img
                src="/logo.png"
                alt="BIS-SATHI"
                className="h-[54px] w-auto object-contain drop-shadow-sm group-hover:drop-shadow-[0_0_14px_rgba(230,92,0,0.45)] transition-all duration-300 animate-logo-entrance"
              />
            </div>
          </Link>

          {/* Search bar (desktop only) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden xl:flex items-center gap-2 rounded-xl border border-outline-variant/60 bg-surface-container-low/80 px-3 py-2.5 text-left shadow-[0_6px_18px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-primary/40 hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 w-64 shrink-0"
            aria-label="Open search (Ctrl+K)"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0 w-[18px] h-[18px] flex items-center justify-center">search</span>
            <span className="flex-1 text-[13px] text-on-surface-variant truncate">Search standards, QCOs...</span>
            <kbd className="rounded-md border border-outline-variant/70 bg-surface-container px-1.5 py-0.5 font-mono text-[10px] text-on-surface-variant shrink-0">⌘K</kbd>
          </button>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme switcher — desktop */}
            <div className="hidden lg:block">
              <ThemeSwitcher />
            </div>

            {/* Language switcher — desktop */}
            <div className="hidden lg:block">
              <LangSwitcher />
            </div>

            {/* Search icon — mobile/tablet */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container-low text-on-surface-variant transition-colors hover:border-primary/30 hover:bg-surface-container hover:text-on-surface xl:hidden"
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Saved items */}
            <Link
              to="/saved"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container-low text-on-surface-variant transition-colors hover:border-primary/30 hover:bg-surface-container hover:text-on-surface"
              aria-label={`Saved items (${savedItems.length})`}
            >
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
              {savedItems.length > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary">
                  {savedItems.length}
                </span>
              )}
            </Link>

            {/* Workspace — desktop/tablet */}
            <Link
              to="/workspace"
              className="hidden lg:flex items-center gap-1.5 rounded-xl border border-outline-variant/50 bg-surface-container-low px-3 py-2 text-[13px] font-medium text-on-surface transition-colors hover:border-primary/30 hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
              <span className="hidden xl:inline">{t('nav.workspace')}</span>
            </Link>

            {/* Sign In — desktop */}
            <Link
              to="/login"
              className="hidden lg:flex items-center gap-1.5 rounded-xl border border-outline-variant/50 bg-surface-container-low px-3 py-2 text-[13px] font-medium text-on-surface transition-colors hover:border-primary/30 hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>Sign In</span>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant/50 bg-surface-container-low text-on-surface-variant transition-colors hover:border-primary/30 hover:bg-surface-container lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
          </div>
        </div>

        {/* ── Sub-nav bar (desktop + tablet only) ── */}
        <div className="hidden lg:block w-full border-t border-outline-variant/40 bg-surface-container-lowest/90 backdrop-blur-md">
          <div className="mx-auto max-w-[1440px] overflow-x-auto px-4 sm:px-5 lg:px-8">
            <nav className="flex items-center gap-0.5 py-1.5 shrink-0" aria-label="Main navigation">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={`rounded-lg px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-all ${
                    isActive(item.path)
                      ? 'bg-primary text-on-primary shadow-[0_8px_18px_rgba(230,92,0,0.18)]'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Tricolor Bar Bottom of Header */}
        <div className="h-1.5 w-full tricolor-bar opacity-80"></div>
      </header>
    </>
  );
}
