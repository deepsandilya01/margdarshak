/**
 * BIS-SATHI Design Tokens
 * Source: Stitch project/4322623989939431589 "BIS-SATHI Compliance Platform"
 * DO NOT hardcode any values from this file in components — always reference via Tailwind classes or CSS vars.
 */

export const colors = {
  // --- Primary ---
  primary: '#00162d',
  'on-primary': '#ffffff',
  'primary-container': '#0f2b48',
  'on-primary-container': '#7a93b5',
  'primary-fixed': '#d2e4ff',
  'primary-fixed-dim': '#afc8ed',
  'on-primary-fixed': '#001c37',
  'on-primary-fixed-variant': '#2f4867',
  'inverse-primary': '#afc8ed',

  // --- Secondary ---
  secondary: '#1d4ed8',
  'on-secondary': '#ffffff',
  'secondary-container': '#4069f2',
  'on-secondary-container': '#fffbff',
  'secondary-fixed': '#dce1ff',
  'secondary-fixed-dim': '#b7c4ff',
  'on-secondary-fixed': '#001551',
  'on-secondary-fixed-variant': '#0039b5',

  // --- Tertiary (Refined Ochre) ---
  tertiary: '#2f0800',
  'on-tertiary': '#ffffff',
  'tertiary-container': '#521400',
  'on-tertiary-container': '#f36330',
  'tertiary-fixed': '#ffdbd0',
  'tertiary-fixed-dim': '#ffb59d',
  'on-tertiary-fixed': '#390c00',
  'on-tertiary-fixed-variant': '#832600',

  // --- Error ---
  error: '#ba1a1a',
  'on-error': '#ffffff',
  'error-container': '#ffdad6',
  'on-error-container': '#93000a',

  // --- Surface ---
  surface: '#faf8ff',
  'surface-dim': '#d2d9f4',
  'surface-bright': '#faf8ff',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#f2f3ff',
  'surface-container': '#eaedff',
  'surface-container-high': '#e2e7ff',
  'surface-container-highest': '#dae2fd',
  'surface-variant': '#dae2fd',
  'surface-tint': '#476080',

  // --- On-Surface ---
  background: '#faf8ff',
  'on-background': '#131b2e',
  'on-surface': '#131b2e',
  'on-surface-variant': '#43474d',

  // --- Outline ---
  outline: '#74777e',
  'outline-variant': '#c4c6ce',

  // --- Inverse ---
  'inverse-surface': '#283044',
  'inverse-on-surface': '#eef0ff',

  // --- Status: Compliant / Certified ---
  'status-compliant-bg': 'var(--status-compliant-bg)',
  'status-compliant-dot': 'var(--status-compliant-dot)',
  'status-compliant-text': 'var(--status-compliant-text)',
  'status-compliant-border': 'var(--status-compliant-border)',

  // --- Status: Pending / In Review ---
  'status-pending-bg': 'var(--status-pending-bg)',
  'status-pending-dot': 'var(--status-pending-dot)',
  'status-pending-text': 'var(--status-pending-text)',
  'status-pending-border': 'var(--status-pending-border)',

  // --- Status: Needs Verification / Non-Compliant ---
  'status-verify-bg': 'var(--status-verify-bg)',
  'status-verify-dot': 'var(--status-verify-dot)',
  'status-verify-text': 'var(--status-verify-text)',
  'status-verify-border': 'var(--status-verify-border)',

  // --- Technical Identifiers (IS Numbers, QCOs) ---
  'tech-id-bg': 'var(--tech-id-bg)',
  'tech-id-border': 'var(--tech-id-border)',
  'tech-id-text': 'var(--tech-id-text)',
} as const;

export const spacing = {
  'space-2xs': '0.125rem',   // 2px
  'space-xs': '0.25rem',     // 4px
  'space-sm': '0.5rem',      // 8px
  'space-md': '0.75rem',     // 12px
  'space-base': '1rem',      // 16px
  'space-lg': '1.25rem',     // 20px
  'space-xl': '1.5rem',      // 24px
  'space-2xl': '2rem',       // 32px
  'space-3xl': '2.5rem',     // 40px
  'space-4xl': '3rem',       // 48px
  'gutter-mobile': '1rem',
  'gutter-tablet': '1.5rem',
  'gutter-desktop': '1.5rem',
  'page-margin-desktop': '2rem',
  'max-content-width': '1440px',
} as const;

export const borderRadius = {
  DEFAULT: '0.125rem',  // 2px — base components (inputs, buttons, badges)
  lg: '0.25rem',        // 4px — medium panels
  xl: '0.5rem',         // 8px — data cards, tables, structural panels
  '2xl': '0.75rem',     // 12px — large modals, drawers
  full: '9999px',       // status dots, notification badges, pill chips
} as const;

export const shadows = {
  'shadow-l0': 'none',
  'shadow-l1': '0 1px 2px 0 rgba(15,23,42,0.04)',
  'shadow-l2': '0 4px 12px -2px rgba(15,23,42,0.08), 0 2px 4px -2px rgba(15,23,42,0.04)',
  'shadow-l3': '0 12px 24px -4px rgba(15,23,42,0.12), 0 4px 6px -2px rgba(15,23,42,0.04)',
  'shadow-xs': '0 1px 2px rgba(15,23,42,0.04)',
  'shadow-sm': '0 1px 4px rgba(15,23,42,0.06)',
  'shadow-md': '0 4px 12px -2px rgba(15,23,42,0.08)',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const;
