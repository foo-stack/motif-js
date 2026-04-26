/**
 * @motif-js/react-web — DOM implementations of motif-js primitives.
 *
 * Exports React components that render real DOM elements with theme-aware
 * style-prop resolution. Internal package — re-exported by
 * `@motif-js/primitives` so end users import from a single place.
 */

export const PACKAGE_NAME = '@motif-js/react-web';

export { Box } from './Box.js';
export type { BoxProps } from './Box.js';

export { Theme, ThemeProvider } from './Theme.js';
export type { ThemeProps, ThemeProviderProps } from './Theme.js';

export { ThemeContext, useTheme } from './theme-context.js';
