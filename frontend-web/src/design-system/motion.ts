/**
 * BIS-SATHI Motion System
 * Restrained, institutional — matches Stitch design's calm, precise transitions.
 * All variants include reduced-motion fallbacks.
 */

export const durations = {
  instant: 0,
  fast: 100,      // micro-interactions, hover states
  normal: 200,    // drawer opens, modal fades
  slow: 350,      // page transitions, panel reveals
  crawl: 500,     // skeleton shimmer
} as const;

export const easings = {
  standard: [0.2, 0, 0, 1],          // Material standard easing
  decelerate: [0, 0, 0.2, 1],        // Enter / reveal
  accelerate: [0.4, 0, 1, 1],        // Exit / dismiss
  sharp: [0.4, 0, 0.6, 1],           // Quick snaps
} as const;

/** Page transition variants — slide up + fade in */
export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.2, 0, 0, 1] } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } },
};

/** Reduced-motion safe variants (no translate) */
export const pageVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

/** Drawer slide-in from right */
export const drawerVariants = {
  closed: { x: '100%', opacity: 0 },
  open: { x: 0, opacity: 1, transition: { duration: 0.25, ease: [0.2, 0, 0, 1] } },
};

export const drawerVariantsReduced = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.15 } },
};

/** Fade + scale for modals */
export const modalVariants = {
  closed: { opacity: 0, scale: 0.97 },
  open: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: [0.2, 0, 0, 1] } },
};

export const modalVariantsReduced = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.15 } },
};

/** Stagger container for list reveals */
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.2, 0, 0, 1] } },
};

export const staggerItemReduced = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.15 } },
};

/** Comparison tray slide-up */
export const trayVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
};

/** Use this hook to determine if reduced motion is preferred */
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
