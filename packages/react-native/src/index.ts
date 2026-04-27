/**
 * @motif-js/react-native — React Native implementations of motif-js
 * primitives. Same prop schema as `@motif-js/react-web`; resolves
 * styles to literal values via JS-context theming (no CSS variables).
 */

export const PACKAGE_NAME = '@motif-js/react-native';

export { Box } from './Box.js';
export type { BoxProps } from './Box.js';

export { HStack, Stack, VStack } from './Stack.js';
export type { StackProps } from './Stack.js';

export { Text } from './Text.js';
export type { TextProps } from './Text.js';

export { Theme, ThemeProvider } from './Theme.js';
export type { ThemeProps, ThemeProviderProps } from './Theme.js';

export { ThemeContext, useTheme, useThemeName } from './theme-context.js';
export type { ThemeContextValue } from './theme-context.js';
