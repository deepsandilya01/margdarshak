export const Typography = {
  // We map from CSS variables from index.css
  displayLg: {
    fontSize: 28, // Using display-lg-mobile for mobile
    lineHeight: 36,
    letterSpacing: -0.02,
    fontWeight: '700' as const,
  },
  headlineLg: {
    fontSize: 22, // headline-lg-mobile
    lineHeight: 30,
    letterSpacing: -0.015,
    fontWeight: '600' as const,
  },
  headlineMd: {
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.015,
    fontWeight: '600' as const,
  },
  headlineSm: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.01,
    fontWeight: '600' as const,
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: -0.005,
    fontWeight: '400' as const,
  },
  bodyMd: {
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  bodySm: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  techCodeLg: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.01,
    fontWeight: '500' as const,
  },
  techCodeSm: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    fontWeight: '500' as const,
  },
  captionCaps: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.05,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  }
};
