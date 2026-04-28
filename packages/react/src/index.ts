/**
 * @motif-js/react — React bindings for motif-js.
 *
 * Re-exports the cross-platform pieces (Box, Theme, ThemeProvider, useTheme)
 * via the renderer-routing package field, plus the framework-agnostic
 * `styled()` factory for authoring styled components.
 */

export const PACKAGE_NAME = '@motif-js/react';

// Re-export from the web renderer. On native, the same exports come from
// @motif-js/react-native via the `react-native` package field (Phase C work).
export {
  Box,
  Button,
  CollectorContext,
  Container,
  HStack,
  Image,
  Pressable,
  SSRStyleCollector,
  Stack,
  Text,
  Theme,
  ThemeContext,
  ThemeProvider,
  VStack,
  useActiveCollector,
  useTheme,
  useThemeName,
} from '@motif-js/react-web';
export type {
  BoxProps,
  ButtonIntent,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  ContainerProps,
  ImageProps,
  PressableProps,
  StackProps,
  TextProps,
  ThemeProps,
  ThemeProviderProps,
} from '@motif-js/react-web';

export { styled } from './styled.js';
export type { CompoundVariant, StyledConfig, VariantProps } from './styled.js';
