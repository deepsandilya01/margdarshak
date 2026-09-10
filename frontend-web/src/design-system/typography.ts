/**
 * BIS-SATHI Typography System
 * Two-engine model: Inter (UI/editorial) + JetBrains Mono (technical identifiers)
 * Source: Stitch project/4322623989939431589
 */

export const fontFamilies = {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
} as const;

export const typeScale = {
  'display-lg': {
    fontFamily: 'Inter',
    fontSize: '36px',
    fontWeight: '700',
    lineHeight: '44px',
    letterSpacing: '-0.025em',
  },
  'display-lg-mobile': {
    fontFamily: 'Inter',
    fontSize: '28px',
    fontWeight: '700',
    lineHeight: '36px',
    letterSpacing: '-0.02em',
  },
  'headline-lg': {
    fontFamily: 'Inter',
    fontSize: '28px',
    fontWeight: '600',
    lineHeight: '36px',
    letterSpacing: '-0.02em',
  },
  'headline-lg-mobile': {
    fontFamily: 'Inter',
    fontSize: '22px',
    fontWeight: '600',
    lineHeight: '30px',
    letterSpacing: '-0.015em',
  },
  'headline-md': {
    fontFamily: 'Inter',
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    letterSpacing: '-0.015em',
  },
  'headline-sm': {
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    letterSpacing: '-0.01em',
  },
  'body-lg': {
    fontFamily: 'Inter',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '26px',
    letterSpacing: '-0.005em',
  },
  'body-md': {
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '22px',
    letterSpacing: '0em',
  },
  'body-sm': {
    fontFamily: 'Inter',
    fontSize: '13px',
    fontWeight: '400',
    lineHeight: '18px',
    letterSpacing: '0em',
  },
  'tech-code-lg': {
    fontFamily: 'JetBrains Mono',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '20px',
    letterSpacing: '-0.01em',
  },
  'tech-code-sm': {
    fontFamily: 'JetBrains Mono',
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '16px',
    letterSpacing: '0em',
  },
  'caption-caps': {
    fontFamily: 'Inter',
    fontSize: '11px',
    fontWeight: '600',
    lineHeight: '16px',
    letterSpacing: '0.05em',
  },
  'label-tabular': {
    fontFamily: 'JetBrains Mono',
    fontSize: '11px',
    fontWeight: '400',
    lineHeight: '14px',
    letterSpacing: '0.02em',
  },
} as const;
