import { createTheme } from '@motif-js/react';
import type { FontFace, ThemeRootStyles } from '@motif-js/react';

// Self-hosted webfont assets in apps/docs/public/fonts/. Two unicode-range
// blocks per family-weight pair so the browser only fetches the subsets the
// page actually needs. The latin block is preloaded by plugins/fonts.ts.
const LATIN_EXT_RANGE =
  'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF';

const LATIN_RANGE =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

const fontFaces: readonly FontFace[] = [
  {
    family: 'Fraunces',
    src: [{ url: '/fonts/fraunces-latin-ext-300_900.woff2', format: 'woff2' }],
    weight: '300 900',
    style: 'normal',
    display: 'swap',
    unicodeRange: LATIN_EXT_RANGE,
  },
  {
    family: 'Fraunces',
    src: [{ url: '/fonts/fraunces-latin-300_900.woff2', format: 'woff2' }],
    weight: '300 900',
    style: 'normal',
    display: 'swap',
    unicodeRange: LATIN_RANGE,
  },
  {
    family: 'Inter',
    src: [{ url: '/fonts/inter-latin-ext-400_700.woff2', format: 'woff2' }],
    weight: '400 700',
    style: 'normal',
    display: 'swap',
    unicodeRange: LATIN_EXT_RANGE,
  },
  {
    family: 'Inter',
    src: [{ url: '/fonts/inter-latin-400_700.woff2', format: 'woff2' }],
    weight: '400 700',
    style: 'normal',
    display: 'swap',
    unicodeRange: LATIN_RANGE,
  },
  {
    family: 'JetBrains Mono',
    src: [{ url: '/fonts/jetbrains-mono-latin-ext-400.woff2', format: 'woff2' }],
    weight: 400,
    style: 'normal',
    display: 'swap',
    unicodeRange: LATIN_EXT_RANGE,
  },
  {
    family: 'JetBrains Mono',
    src: [{ url: '/fonts/jetbrains-mono-latin-400.woff2', format: 'woff2' }],
    weight: 400,
    style: 'normal',
    display: 'swap',
    unicodeRange: LATIN_RANGE,
  },
  {
    family: 'JetBrains Mono',
    src: [{ url: '/fonts/jetbrains-mono-latin-ext-500.woff2', format: 'woff2' }],
    weight: 500,
    style: 'normal',
    display: 'swap',
    unicodeRange: LATIN_EXT_RANGE,
  },
  {
    family: 'JetBrains Mono',
    src: [{ url: '/fonts/jetbrains-mono-latin-500.woff2', format: 'woff2' }],
    weight: 500,
    style: 'normal',
    display: 'swap',
    unicodeRange: LATIN_RANGE,
  },
  {
    family: 'JetBrains Mono',
    src: [{ url: '/fonts/jetbrains-mono-latin-ext-700.woff2', format: 'woff2' }],
    weight: 700,
    style: 'normal',
    display: 'swap',
    unicodeRange: LATIN_EXT_RANGE,
  },
  {
    family: 'JetBrains Mono',
    src: [{ url: '/fonts/jetbrains-mono-latin-700.woff2', format: 'woff2' }],
    weight: 700,
    style: 'normal',
    display: 'swap',
    unicodeRange: LATIN_RANGE,
  },
];

// Body / ::selection resets, ported from theme.css's `html { ... }` block.
// Token references resolve via the CSS-variable cascade so the styling
// flips automatically when ThemeToggle swaps `<html data-theme>`.
const root: ThemeRootStyles = {
  background: '$colors.bg.base',
  color: '$colors.fg.base',
  fontFamily: '$fontFamilies.sans',
  fontSize: '$fontSizes.md',
  lineHeight: '$lineHeights.prose',
  fontFeatureSettings: "'ss01', 'cv11'",
  WebkitFontSmoothing: 'antialiased',
  textRendering: 'optimizeLegibility',
  selectionBackground: '$colors.selection.bg',
  selectionColor: '$colors.fg.strong',
};

const palette = {
  paper: {
    50: '#FDFAF5',
    100: '#FBF7F2',
    200: '#F5EFE6',
    300: '#EDE5D7',
    400: '#DFD4C0',
  },
  ink: {
    50: '#78716C',
    100: '#57534E',
    200: '#44403C',
    300: '#2C2A26',
    400: '#1C1917',
    500: '#13110E',
    600: '#0E0B08',
  },
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
  terracotta: {
    50: '#FFF4ED',
    100: '#FFE3CC',
    300: '#FB923C',
    500: '#EA580C',
    600: '#C2410C',
    700: '#9A3412',
    800: '#7C2D12',
  },
  moss: { 100: '#E8ECDA', 500: '#65733C' },
  ochre: { 100: '#FEF3C7', 500: '#B45309' },
  brick: { 100: '#FEE2E2', 500: '#B91C1C' },
  slate: { 100: '#E2E8F0', 500: '#475569' },
} as const;

const fonts = {
  display: '"Fraunces", "Iowan Old Style", "Charter", "Georgia", serif',
  sans: '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", "Menlo", monospace',
};

const fontSizes = {
  '2xs': '0.6875rem',
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  md: '1.0625rem',
  lg: '1.25rem',
  xl: '1.5rem',
  '2xl': '1.875rem',
  '3xl': '2.25rem',
  '4xl': '3rem',
  '5xl': '3.75rem',
  '6xl': '4.5rem',
  display: '6rem',
};

const fontWeights = { regular: 400, medium: 500, semibold: 600, bold: 700 };

const lineHeights = { tight: 1.1, snug: 1.25, normal: 1.5, prose: 1.65 };

const letterSpacings = {
  tight: '-0.02em',
  normal: '0',
  wide: '0.06em',
  widest: '0.12em',
};

const space = {
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
  '20': 80,
  '24': 96,
  '32': 128,
};

const radii = { xs: 2, sm: 4, base: 6, md: 8, lg: 12, full: 999 };

const sizes = {
  'container.prose': 660,
  'container.text': 720,
  'container.app': 1200,
  'container.wide': 1440,
};

const durations = {
  press: '80ms',
  ui: '160ms',
  page: '240ms',
  hero: '400ms',
};

const easings = {
  base: 'cubic-bezier(0.2, 0, 0, 1)',
  inOut: 'cubic-bezier(0.45, 0, 0.55, 1)',
};

const lightShadows = {
  '1': '0 1px 2px rgb(28 25 23 / 0.04)',
  '2': '0 1px 2px rgb(28 25 23 / 0.04), 0 4px 12px rgb(28 25 23 / 0.04)',
  '3': '0 2px 4px rgb(28 25 23 / 0.05), 0 12px 32px rgb(28 25 23 / 0.06)',
};

const darkShadows = {
  '1': '0 1px 2px rgb(0 0 0 / 0.3)',
  '2': '0 1px 2px rgb(0 0 0 / 0.3), 0 4px 12px rgb(0 0 0 / 0.25)',
  '3': '0 2px 4px rgb(0 0 0 / 0.35), 0 12px 32px rgb(0 0 0 / 0.4)',
};

const semanticLight = {
  bg: { base: palette.paper[100] },
  paper: palette.paper,
  ink: palette.ink,
  stone: palette.stone,
  terracotta: palette.terracotta,
  moss: palette.moss,
  ochre: palette.ochre,
  brick: palette.brick,
  slate: palette.slate,
  surface: {
    paper: palette.paper[100],
    paper2: palette.paper[200],
    paper3: palette.paper[300],
    inverse: palette.ink[400],
  },
  fg: {
    base: palette.ink[400],
    strong: palette.ink[500],
    muted: palette.ink[100],
    faint: palette.stone[400],
    onAccent: palette.paper[100],
    onInverse: palette.paper[100],
  },
  line: {
    base: 'color-mix(in oklab, #1C1917 12%, transparent)',
    strong: 'color-mix(in oklab, #1C1917 22%, transparent)',
    faint: 'color-mix(in oklab, #1C1917 6%, transparent)',
  },
  accent: {
    base: palette.terracotta[600],
    hover: palette.terracotta[700],
    soft: palette.terracotta[50],
    fg: palette.paper[100],
    // `muted` is the active-state foreground for chrome navigation
    // (sidebar / TOC active-link color). In light mode it matches
    // accent.base; in dark mode it shifts to terracotta-300 for
    // sufficient contrast against the dark surface — matching the
    // pre-migration `[data-theme='dark'] .side-link--active` rule
    // in chrome.css.
    muted: palette.terracotta[600],
  },
  status: {
    success: palette.moss[500],
    successSoft: palette.moss[100],
    warning: palette.ochre[500],
    warningSoft: palette.ochre[100],
    error: palette.brick[500],
    errorSoft: palette.brick[100],
    info: palette.slate[500],
    infoSoft: palette.slate[100],
  },
  selection: {
    bg: 'color-mix(in oklab, #C2410C 22%, transparent)',
  },
  focus: {
    ring: 'color-mix(in oklab, #C2410C 40%, transparent)',
  },
};

const semanticDark = {
  bg: { base: palette.ink[500] },
  paper: palette.paper,
  ink: palette.ink,
  stone: palette.stone,
  terracotta: palette.terracotta,
  moss: palette.moss,
  ochre: palette.ochre,
  brick: palette.brick,
  slate: palette.slate,
  surface: {
    paper: palette.ink[500],
    paper2: '#1A1714',
    paper3: '#221E1A',
    inverse: palette.paper[100],
  },
  fg: {
    base: palette.paper[100],
    strong: palette.paper[50],
    muted: '#C7BFB1',
    faint: palette.stone[400],
    onAccent: palette.paper[100],
    onInverse: palette.ink[400],
  },
  line: {
    base: 'color-mix(in oklab, #FBF7F2 12%, transparent)',
    strong: 'color-mix(in oklab, #FBF7F2 22%, transparent)',
    faint: 'color-mix(in oklab, #FBF7F2 6%, transparent)',
  },
  accent: {
    base: palette.terracotta[500],
    hover: palette.terracotta[300],
    soft: 'color-mix(in oklab, #C2410C 18%, transparent)',
    fg: palette.ink[500],
    // Lighter terracotta in dark mode for active-state foregrounds.
    // See semanticLight.accent.muted comment for context.
    muted: palette.terracotta[300],
  },
  status: {
    success: '#98B069',
    successSoft: 'color-mix(in oklab, #98B069 18%, transparent)',
    warning: '#E0A95E',
    warningSoft: 'color-mix(in oklab, #E0A95E 18%, transparent)',
    error: '#DC6B6B',
    errorSoft: 'color-mix(in oklab, #DC6B6B 18%, transparent)',
    info: '#9AAEC2',
    infoSoft: 'color-mix(in oklab, #9AAEC2 18%, transparent)',
  },
  selection: {
    bg: 'color-mix(in oklab, #EA580C 28%, transparent)',
  },
  focus: {
    ring: 'color-mix(in oklab, #EA580C 50%, transparent)',
  },
};

export const lightTheme = createTheme({
  name: 'light',
  tokens: {
    colors: semanticLight,
    space,
    sizes,
    radii,
    fontSizes,
    fontWeights,
    fontFamilies: fonts,
    lineHeights,
    letterSpacings,
    shadows: lightShadows,
    durations,
    easings,
  },
  // @font-face decls + body / ::selection resets + reduced-motion guard
  // are deduped/merged across themes by motif's runtime emitter, so a
  // single declaration on lightTheme covers both modes.
  fonts: fontFaces,
  root,
  reducedMotion: 'guard',
});

export const darkTheme = createTheme({
  name: 'dark',
  tokens: {
    colors: semanticDark,
    space,
    sizes,
    radii,
    fontSizes,
    fontWeights,
    fontFamilies: fonts,
    lineHeights,
    letterSpacings,
    shadows: darkShadows,
    durations,
    easings,
  },
});

export const themes = [lightTheme, darkTheme] as const;
