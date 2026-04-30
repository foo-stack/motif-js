import { createTheme } from '@motif-js/react';

/**
 * Motif brand tokens — ported from `~/Downloads/Motif Design System/colors_and_type.css`.
 *
 * The shape mirrors `@motif-js/tokens`' `lightTheme` / `darkTheme`
 * (surface / text / border / action) so semantic prop references like
 * `bg="$colors.surface.muted"` work the same as in the canonical
 * preset themes — just resolved against warm paper, ink, and
 * terracotta values instead of the gray + blue defaults.
 */

const colors = {
  // Cream / paper — warm off-whites
  paper: {
    50: '#FDFAF5',
    100: '#FBF7F2',
    200: '#F5EFE6',
    300: '#EDE5D7',
    400: '#DFD4C0',
  },

  // Ink / warm dark — slightly brown, never pure black
  ink: {
    50: '#78716C',
    100: '#57534E',
    200: '#44403C',
    300: '#2C2A26',
    400: '#1C1917',
    500: '#13110E',
    600: '#0E0B08',
    // Two off-scale dark surfaces called out in the source CSS
    paper2: '#1A1714',
    paper3: '#221E1A',
  },

  // Stone — warm neutrals
  stone: {
    50: '#F5F5F4',
    100: '#E7E5E4',
    200: '#D6D3D1',
    300: '#A8A29E',
    400: '#78716C',
    500: '#57534E',
    600: '#44403C',
    700: '#292524',
  },

  // Terracotta — the accent
  terracotta: {
    50: '#FFF4ED',
    100: '#FFE3CC',
    300: '#FB923C',
    500: '#EA580C',
    600: '#C2410C',
    700: '#9A3412',
    800: '#7C2D12',
  },

  // Earthy semantic — desaturated, warm
  moss: { 100: '#E8ECDA', 500: '#65733C' },
  ochre: { 100: '#FEF3C7', 500: '#B45309' },
  brick: { 100: '#FEE2E2', 500: '#B91C1C' },
  slate: { 100: '#E2E8F0', 500: '#475569' },
};

const sharedTokens = {
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
  },
  radii: {
    xs: 2,
    sm: 4,
    md: 6, // brand default — quiet, not pillowy
    lg: 8,
    xl: 12,
    full: 9999,
  },
  fonts: {
    display: 'Fraunces, "Iowan Old Style", Charter, Georgia, serif',
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  },
  fontSizes: {
    '2xs': 11,
    xs: 12,
    sm: 14,
    base: 16,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
    '4xl': 48,
    '5xl': 60,
    '6xl': 72,
    display: 96,
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    prose: 1.65,
  },
  durations: {
    press: '80ms',
    ui: '160ms',
    page: '240ms',
    hero: '400ms',
  },
  easings: {
    default: 'cubic-bezier(0.2, 0, 0, 1)',
    inOut: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  sizes: {
    containerProse: 660,
    containerText: 720,
    containerApp: 1200,
    containerWide: 1440,
  },
};

/**
 * Light (default). Warm cream paper, ink foreground, terracotta
 * accent. Reserved for any context where a single theme is active.
 */
export const paperTheme = createTheme({
  name: 'paper',
  tokens: {
    colors: {
      ...colors,
      surface: {
        base: '$colors.paper.100',
        muted: '$colors.paper.200',
        raised: '$colors.paper.100',
        sunken: '$colors.paper.300',
        inverse: '$colors.ink.400',
      },
      text: {
        default: '$colors.ink.400',
        strong: '$colors.ink.500',
        muted: '$colors.ink.100',
        faint: '$colors.stone.400',
        inverse: '$colors.paper.100',
      },
      border: {
        default: 'rgb(28 25 23 / 0.12)',
        muted: 'rgb(28 25 23 / 0.06)',
        strong: 'rgb(28 25 23 / 0.22)',
      },
      action: {
        primary: {
          bg: '$colors.terracotta.600',
          fg: '$colors.paper.100',
          hover: '$colors.terracotta.700',
        },
        success: { bg: '$colors.moss.500', fg: '$colors.paper.100' },
        warning: { bg: '$colors.ochre.500', fg: '$colors.paper.100' },
        danger: { bg: '$colors.brick.500', fg: '$colors.paper.100' },
        info: { bg: '$colors.slate.500', fg: '$colors.paper.100' },
      },
      accent: '$colors.terracotta.600',
      accentHover: '$colors.terracotta.700',
      accentSoft: '$colors.terracotta.50',
      accentFg: '$colors.paper.100',
      focusRing: 'rgb(194 65 12 / 0.40)',
      selectionBg: 'rgb(194 65 12 / 0.22)',
    },
    ...sharedTokens,
  },
});

/**
 * Dark sub-theme. Warm ink paper, cream foreground, slightly brighter
 * terracotta to compensate for the dark surround.
 */
export const inkTheme = createTheme({
  name: 'ink',
  tokens: {
    colors: {
      ...colors,
      surface: {
        base: '$colors.ink.500',
        muted: '$colors.ink.paper2',
        raised: '$colors.ink.paper2',
        sunken: '$colors.ink.paper3',
        inverse: '$colors.paper.100',
      },
      text: {
        default: '$colors.paper.100',
        strong: '$colors.paper.50',
        muted: '#C7BFB1',
        faint: '$colors.stone.400',
        inverse: '$colors.ink.400',
      },
      border: {
        default: 'rgb(251 247 242 / 0.12)',
        muted: 'rgb(251 247 242 / 0.06)',
        strong: 'rgb(251 247 242 / 0.22)',
      },
      action: {
        primary: {
          bg: '$colors.terracotta.500',
          fg: '$colors.paper.100',
          hover: '$colors.terracotta.300',
        },
        success: { bg: '#98B069', fg: '$colors.ink.500' },
        warning: { bg: '#E0A95E', fg: '$colors.ink.500' },
        danger: { bg: '#DC6B6B', fg: '$colors.paper.100' },
        info: { bg: '#9AAEC2', fg: '$colors.ink.500' },
      },
      accent: '$colors.terracotta.500',
      accentHover: '$colors.terracotta.300',
      accentSoft: 'rgb(194 65 12 / 0.18)',
      accentFg: '$colors.ink.500',
      focusRing: 'rgb(234 88 12 / 0.50)',
      selectionBg: 'rgb(234 88 12 / 0.28)',
    },
    ...sharedTokens,
  },
});

/**
 * Accent variants for the tweaks-panel accent picker. Each entry
 * defines the four `accent*` token bindings + a focus-ring tint that
 * derives from the same hue. We pre-build `paper_<accent>` and
 * `ink_<accent>` combinations and pass them to `<ThemeProvider>` so
 * the cascade resolves them via the dot-walked sub-theme name (the
 * docs-page itself is wrapped in a single `<ThemeProvider active>`
 * with the resolved name — no `<Theme>` boundary needed).
 */
export const ACCENT_NAMES = ['terracotta', 'moss', 'ochre', 'slate', 'brick'] as const;
export type AccentName = (typeof ACCENT_NAMES)[number];

interface AccentPaint {
  readonly accent: string;
  readonly accentHoverLight: string;
  readonly accentHoverDark: string;
  readonly accentSoftLight: string;
  readonly accentSoftDark: string;
  readonly focusRing: string;
  readonly selectionBg: string;
}

const ACCENT_PAINTS: Record<AccentName, AccentPaint> = {
  terracotta: {
    accent: '#C2410C',
    accentHoverLight: '#9A3412',
    accentHoverDark: '#FB923C',
    accentSoftLight: '#FFF4ED',
    accentSoftDark: 'rgb(194 65 12 / 0.18)',
    focusRing: 'rgb(194 65 12 / 0.40)',
    selectionBg: 'rgb(194 65 12 / 0.22)',
  },
  moss: {
    accent: '#65733C',
    accentHoverLight: '#4D5A2D',
    accentHoverDark: '#98B069',
    accentSoftLight: '#E8ECDA',
    accentSoftDark: 'rgb(101 115 60 / 0.20)',
    focusRing: 'rgb(101 115 60 / 0.40)',
    selectionBg: 'rgb(101 115 60 / 0.22)',
  },
  ochre: {
    accent: '#B45309',
    accentHoverLight: '#8C4308',
    accentHoverDark: '#E0A95E',
    accentSoftLight: '#FEF3C7',
    accentSoftDark: 'rgb(180 83 9 / 0.20)',
    focusRing: 'rgb(180 83 9 / 0.40)',
    selectionBg: 'rgb(180 83 9 / 0.22)',
  },
  slate: {
    accent: '#475569',
    accentHoverLight: '#334155',
    accentHoverDark: '#9AAEC2',
    accentSoftLight: '#E2E8F0',
    accentSoftDark: 'rgb(71 85 105 / 0.22)',
    focusRing: 'rgb(71 85 105 / 0.40)',
    selectionBg: 'rgb(71 85 105 / 0.22)',
  },
  brick: {
    accent: '#B91C1C',
    accentHoverLight: '#991B1B',
    accentHoverDark: '#DC6B6B',
    accentSoftLight: '#FEE2E2',
    accentSoftDark: 'rgb(185 28 28 / 0.20)',
    focusRing: 'rgb(185 28 28 / 0.40)',
    selectionBg: 'rgb(185 28 28 / 0.22)',
  },
};

/** Hex preview swatch for the picker UI. Matches the on-`paper` accent. */
export function accentSwatch(name: AccentName): string {
  return ACCENT_PAINTS[name].accent;
}

function buildAccentTheme(base: 'paper' | 'ink', accentName: AccentName) {
  const paint = ACCENT_PAINTS[accentName];
  const baseTheme = base === 'paper' ? paperTheme : inkTheme;
  return createTheme({
    name: `${base}_${accentName}`,
    tokens: {
      ...baseTheme.tokens,
      colors: {
        ...baseTheme.tokens.colors,
        accent: paint.accent,
        accentHover: base === 'paper' ? paint.accentHoverLight : paint.accentHoverDark,
        accentSoft: base === 'paper' ? paint.accentSoftLight : paint.accentSoftDark,
        focusRing: paint.focusRing,
        selectionBg: paint.selectionBg,
      },
    },
  });
}

/** Pre-built accent combinations, registered alongside `paperTheme` /
 *  `inkTheme` so the cascade can resolve the dot-walked name. */
export const accentThemes = ACCENT_NAMES.flatMap((accent) => [
  buildAccentTheme('paper', accent),
  buildAccentTheme('ink', accent),
]);
