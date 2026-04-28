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
  AspectRatio,
  Box,
  Button,
  Center,
  CollectorContext,
  Container,
  Flex,
  Grid,
  HStack,
  Image,
  Pressable,
  SSRStyleCollector,
  SafeArea,
  Spacer,
  Stack,
  Text,
  Theme,
  ThemeContext,
  ThemeProvider,
  VStack,
  Wrap,
  ZStack,
  useActiveCollector,
  useTheme,
  useThemeName,
} from '@motif-js/react-web';
export type {
  AspectRatioProps,
  BoxProps,
  ButtonIntent,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
  CenterProps,
  ContainerProps,
  FlexProps,
  GridProps,
  ImageProps,
  PressableProps,
  SafeAreaProps,
  SpacerProps,
  StackProps,
  TextProps,
  ThemeProps,
  ThemeProviderProps,
  WrapProps,
  ZStackProps,
} from '@motif-js/react-web';

export { Blockquote, Code, Heading, Kbd, Paragraph } from '@motif-js/react-web';
export type {
  BlockquoteProps,
  CodeProps,
  HeadingProps,
  KbdProps,
  ParagraphProps,
} from '@motif-js/react-web';

export { styled } from './styled.js';
export type { CompoundVariant, StyledConfig, VariantProps } from './styled.js';
