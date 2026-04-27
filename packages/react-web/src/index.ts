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

export { Container } from './Container.js';
export type { ContainerProps } from './Container.js';

export { HStack, Stack, VStack } from './Stack.js';
export type { StackProps } from './Stack.js';

export { Text } from './Text.js';
export type { TextProps } from './Text.js';

export { Theme, ThemeProvider } from './Theme.js';
export type { ThemeProps, ThemeProviderProps } from './Theme.js';

export { ThemeContext, useTheme, useThemeName } from './theme-context.js';
export type { ThemeContextValue } from './theme-context.js';

export { SSRStyleCollector, flushPendingCss, injectAtRules } from './style-cache.js';
export type { AtRule } from './style-cache.js';
