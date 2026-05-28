import type { Preview } from '@storybook/react';
import { useMemo } from 'react';
import { Theme, ThemeProvider, type FontFace, type ThemeRootStyles } from 'usemotif';
import { darkTheme, lightTheme } from '@usemotif/tokens';

/**
 * Inter Variable, served from the upstream CDN. Emitted once as an `@font-face`
 * by `<ThemeProvider>` via the theme `fonts` field (deduped across themes) —
 * the idiomatic Motif way to register a typeface, rather than a raw `<link>`.
 */
const UIKIT_FONTS: readonly FontFace[] = [
  {
    family: 'Inter',
    src: [{ url: 'https://rsms.me/inter/font-files/Inter-roman.var.woff2?v=4.0', format: 'woff2' }],
    weight: '100 900',
    style: 'normal',
    display: 'swap',
  },
];

/**
 * Document-root resets. `fontFamily` cascades to every primitive (motif text
 * primitives inherit rather than hard-code a family), so this swaps the whole
 * showcase off system-ui onto Inter. Token-referenced colours track the active
 * theme automatically.
 */
const UIKIT_ROOT: ThemeRootStyles = {
  fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  selectionBackground: '$colors.action.primary.bg',
  selectionColor: '$colors.action.primary.fg',
};

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'todo' },
    layout: 'padded',
  },
  globalTypes: {
    theme: {
      description: 'Active theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    subTheme: {
      description: 'Wrap the story in an inverted <Theme> island',
      defaultValue: 'off',
      toolbar: {
        title: 'Sub-theme',
        icon: 'mirror',
        items: [
          { value: 'off', title: 'No sub-theme' },
          { value: 'invert', title: 'Invert (Theme island)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const active = (context.globals.theme as 'light' | 'dark') ?? 'light';
      const sub = context.globals.subTheme as 'off' | 'invert';
      const themes = useMemo(
        () => [
          { ...lightTheme, fonts: UIKIT_FONTS, root: UIKIT_ROOT },
          { ...darkTheme, fonts: UIKIT_FONTS, root: UIKIT_ROOT },
        ],
        [],
      );
      const inverted = active === 'light' ? 'dark' : 'light';
      return (
        <ThemeProvider themes={themes} active={active}>
          {sub === 'invert' ? (
            <Theme name={inverted}>
              <Story />
            </Theme>
          ) : (
            <Story />
          )}
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
