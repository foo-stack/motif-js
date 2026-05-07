/**
 * @motif-js/react — cross-platform bindings for motif-js.
 *
 * Native entry. Reached via the package's `react-native` exports
 * condition when bundled by Metro / Expo. The web counterpart at
 * `./index.ts` re-exports from `@motif-js/react-web`; this file
 * re-exports the parallel surface from `@motif-js/react-native`.
 */

export const PACKAGE_NAME = '@motif-js/react';

export { createTheme, makeKeyframe as keyframes } from '@motif-js/core';
export type {
  AnimationObject,
  AnimationValue,
  FontFace,
  FontSource,
  Keyframe,
  KeyframeDef,
  PseudoElementStyleBag,
  PseudoElementStyleProps,
  ReducedMotionMode,
  ThemeRootStyles,
  TokenMap,
} from '@motif-js/core';

export {
  AspectRatio,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  HStack,
  Image,
  Pressable,
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
  useTheme,
  useThemeName,
} from '@motif-js/react-native';
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
} from '@motif-js/react-native';

export { Blockquote, Code, Heading, Kbd, Paragraph } from '@motif-js/react-native';
export type {
  BlockquoteProps,
  CodeProps,
  HeadingProps,
  KbdProps,
  ParagraphProps,
} from '@motif-js/react-native';

export { IconButton, Link } from '@motif-js/react-native';
export type {
  IconButtonIntent,
  IconButtonProps,
  IconButtonSize,
  IconButtonVariant,
  LinkProps,
} from '@motif-js/react-native';

export { Avatar, Icon, Svg } from '@motif-js/react-native';
export type { AvatarProps, AvatarSize, IconProps, SvgProps } from '@motif-js/react-native';

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
} from '@motif-js/react-native';
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
} from '@motif-js/react-native';

export { ScrollView, Sticky, VirtualList } from '@motif-js/react-native';
export type { ScrollViewProps, StickyProps, VirtualListProps } from '@motif-js/react-native';

export {
  FocusScope,
  Hide,
  LiveRegion,
  Overlay,
  Portal,
  Show,
  VisuallyHidden,
} from '@motif-js/react-native';
export type {
  FocusScopeProps,
  LiveRegionProps,
  OverlayProps,
  PortalProps,
  ShowHideProps,
  VisuallyHiddenProps,
} from '@motif-js/react-native';

export { styled } from './styled.native.js';
export type { CompoundVariant, StyledConfig, VariantProps } from './styled.native.js';
