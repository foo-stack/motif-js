/**
 * Default primitive tokens. Theme-independent palette + scales.
 *
 * Color palette is Radix-Colors-inspired (12-step scales for each hue,
 * each step has a stable semantic role like "step 9 = solid backgrounds",
 * "step 11 = high-contrast text"). Spacing is Tailwind-style 4px grid.
 *
 * This is a starter set - extend it as needed for your design system.
 */

export const colors = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },

  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
} as const;

/** 4-pixel-grid spacing scale. Pixel values; React inline-styles auto-add `px`. */
export const space = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,
} as const;

export const sizes = {
  ...space,
  full: '100%',
  half: '50%',
  third: '33.333333%',
  twoThirds: '66.666667%',
  screen: '100vw',
  screenH: '100vh',
} as const;

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

/**
 * Border-width scale. Pixel values; `hairline` is sub-pixel so it
 * renders as a true hairline on high-DPI web and stays crisp on
 * native. The `borderWidth*` style props resolve `$`-refs against this.
 */
export const borderWidths = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  thick: 2,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
} as const;

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

/**
 * Letter-spacing (tracking) scale. Pixel values - React appends `px`
 * on web and React Native reads them as DIPs, so the same numbers
 * resolve correctly on both renderers. The `letterSpacing` style prop
 * resolves `$`-refs against this.
 */
export const letterSpacings = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
} as const;

export const fontFamilies = {
  sans: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

export const zIndices = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1700,
  tooltip: 1800,
} as const;

export const opacities = {
  0: 0,
  25: 0.25,
  50: 0.5,
  75: 0.75,
  100: 1,
} as const;

/**
 * Transition durations. Values are CSS time strings; numeric keys roughly
 * correspond to "speed levels" (1 = quickest, 7 = longest). Designed to
 * pair with {@link easings}.
 */
export const durations = {
  0: '0ms',
  1: '75ms',
  2: '150ms',
  3: '200ms',
  4: '300ms',
  5: '500ms',
  6: '700ms',
  7: '1000ms',
} as const;

/**
 * Easing curves. Material-style names (`standard`, `decelerate`,
 * `accelerate`) plus the four CSS keyword shorthands. Pair with
 * {@link durations} via the `transition` prop.
 */
export const easings = {
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  linear: 'linear',
  ease: 'ease',
  in: 'ease-in',
  out: 'ease-out',
  inOut: 'ease-in-out',
} as const;

/**
 * Named-curve animation presets - pair a duration with an easing /
 * spring config. Use via the `animation` prop:
 *
 * ```tsx
 * <Box animation="bouncy" enterStyle={{ scale: 0.8 }}>
 * ```
 *
 * Web renders each preset as a CSS transition (the spring fields fall
 * back to a fitted `cubic-bezier`). Native renders timing animations
 * via the default driver and spring animations via Reanimated when
 * registered. Themes can override individual entries.
 */
export const animations = {
  /** ~150 ms - small UI affordances (tooltips, toggles). */
  quick: { duration: '$durations.2', easing: '$easings.standard' },
  /** ~200 ms - default for most prop-change transitions. */
  normal: { duration: '$durations.3', easing: '$easings.standard' },
  /** ~500 ms - long, decelerating motion (drawers, sheets). */
  slow: { duration: '$durations.5', easing: '$easings.decelerate' },
  /** Overshoot easing - cubic-bezier tuned to feel like a soft spring. */
  bouncy: { duration: '$durations.4', easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  /** Snappy spring config - UI-thread on native (with Reanimated), CSS
   * approximation on web. */
  snappy: { type: 'spring', mass: 0.7, damping: 18, stiffness: 220 },
  /** Gentle spring config - slower decay than `snappy`. */
  lazy: { type: 'spring', mass: 1.2, damping: 14, stiffness: 80 },
} as const;
