/**
 * @motif-js/react — cross-platform bindings for motif-js.
 *
 * This file is the web entry. The package's `react-native` exports
 * condition routes Metro to `./index.native.js`, so a single
 * `@motif-js/react` install works on both platforms.
 */

export const PACKAGE_NAME = '@motif-js/react';

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

export { keyframes } from '@motif-js/react-web';
export type { Keyframe, KeyframeDef } from '@motif-js/react-web';

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

export { IconButton, Link } from '@motif-js/react-web';
export type {
  IconButtonIntent,
  IconButtonProps,
  IconButtonSize,
  IconButtonVariant,
  LinkProps,
} from '@motif-js/react-web';

export { Avatar, Icon, Svg } from '@motif-js/react-web';
export type { AvatarProps, AvatarSize, IconProps, SvgProps } from '@motif-js/react-web';

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
} from '@motif-js/react-web';
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
} from '@motif-js/react-web';

export { ScrollView, Sticky, VirtualList } from '@motif-js/react-web';
export type { ScrollViewProps, StickyProps, VirtualListProps } from '@motif-js/react-web';

export {
  FocusScope,
  Hide,
  LiveRegion,
  Overlay,
  Portal,
  Show,
  VisuallyHidden,
} from '@motif-js/react-web';
export type {
  FocusScopeProps,
  LiveRegionProps,
  OverlayProps,
  PortalProps,
  ShowHideProps,
  VisuallyHiddenProps,
} from '@motif-js/react-web';

export { styled } from './styled.js';
export type { CompoundVariant, StyledConfig, VariantProps } from './styled.js';
