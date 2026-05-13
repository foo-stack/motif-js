/**
 * usemotif — cross-platform React styling.
 *
 * This file is the web entry. The package's `react-native` exports
 * condition routes Metro to `./index.native.js`, so a single
 * `usemotif` install works on both platforms.
 *
 * For web-only / tree-shake-sensitive builds, install
 * `@motif-js/react` directly — that's the DOM bindings this file
 * re-exports. For native-only builds, install `@motif-js/react-native`.
 *
 * (Renamed from `@motif-js/react` in v2.0.0. The npm name
 * `@motif-js/react` now refers to the DOM bindings package, which was
 * `@motif-js/react-web` in v1. The unscoped `motif-js` name was the
 * original v2 plan; npm blocked it at publish time — too similar to
 * an existing `motif.js` package — so v2's meta package ships as
 * `usemotif`, aligning with the docs domain at <usemotif.dev>.)
 */

export const PACKAGE_NAME = 'usemotif';

export { createTheme } from '@motif-js/core';
export type {
  AnimationObject,
  AnimationValue,
  FontFace,
  FontSource,
  FontVariationAxisSettings,
  PseudoElementStyleBag,
  PseudoElementStyleProps,
  ReducedMotionMode,
  ThemeRootStyles,
  TokenMap,
} from '@motif-js/core';

export { keyframes } from '@motif-js/react';
export type { Keyframe, KeyframeDef } from '@motif-js/react';

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
} from '@motif-js/react';
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
} from '@motif-js/react';

export { Blockquote, Code, Heading, Kbd, Paragraph } from '@motif-js/react';
export type {
  BlockquoteProps,
  CodeProps,
  HeadingProps,
  KbdProps,
  ParagraphProps,
} from '@motif-js/react';

export { IconButton, Link } from '@motif-js/react';
export type {
  IconButtonIntent,
  IconButtonProps,
  IconButtonSize,
  IconButtonVariant,
  LinkProps,
} from '@motif-js/react';

export { Avatar, Icon, Svg } from '@motif-js/react';
export type { AvatarProps, AvatarSize, IconProps, SvgProps } from '@motif-js/react';

export {
  Field,
  FieldError,
  FieldHelp,
  Fieldset,
  Input,
  Label,
  NumberInput,
  PasswordInput,
  TextArea,
} from '@motif-js/react';
export type {
  FieldErrorProps,
  FieldHelpProps,
  FieldProps,
  FieldsetProps,
  InputProps,
  LabelProps,
  NumberInputProps,
  PasswordInputProps,
  TextAreaProps,
} from '@motif-js/react';

export { ScrollView, Sticky, VirtualList } from '@motif-js/react';
export type { ScrollViewProps, StickyProps, VirtualListProps } from '@motif-js/react';

export {
  FocusScope,
  Hide,
  LiveRegion,
  Overlay,
  Portal,
  Show,
  VisuallyHidden,
} from '@motif-js/react';
export type {
  FocusScopeProps,
  LiveRegionProps,
  OverlayProps,
  PortalProps,
  ShowHideProps,
  VisuallyHiddenProps,
} from '@motif-js/react';

export { styled } from './styled.js';
export type { CompoundVariant, StyledConfig, VariantProps } from './styled.js';
