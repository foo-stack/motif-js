/**
 * @motif-js/react-web — DOM implementations of motif-js primitives.
 *
 * Exports React components that render real DOM elements with theme-aware
 * style-prop resolution. End users import from `@motif-js/react`, which
 * re-exports this package's surface plus the `styled()` factory.
 */

export const PACKAGE_NAME = '@motif-js/react-web';

export { createTheme } from '@motif-js/core';
export type {
  AnimationObject,
  AnimationValue,
  FontFace,
  FontSource,
  PseudoElementStyleBag,
  PseudoElementStyleProps,
  ReducedMotionMode,
  ThemeRootStyles,
  TokenMap,
} from '@motif-js/core';

export { keyframes } from './keyframes.js';
export type { Keyframe, KeyframeDef } from './keyframes.js';

export { Box } from './Box.js';
export { Button } from './Button.js';
export type { ButtonIntent, ButtonProps, ButtonSize, ButtonVariant } from './Button.js';
export type { BoxProps } from './Box.js';

export {
  AspectRatio,
  Center,
  Flex,
  Grid,
  SafeArea,
  Spacer,
  Wrap,
  ZStack,
} from './layout-extras.js';
export type {
  AspectRatioProps,
  CenterProps,
  FlexProps,
  GridProps,
  SafeAreaProps,
  SpacerProps,
  WrapProps,
  ZStackProps,
} from './layout-extras.js';

export { Blockquote, Code, Heading, Kbd, Paragraph } from './typography.js';
export type {
  BlockquoteProps,
  CodeProps,
  HeadingProps,
  KbdProps,
  ParagraphProps,
} from './typography.js';

export { IconButton } from './IconButton.js';
export type {
  IconButtonIntent,
  IconButtonProps,
  IconButtonSize,
  IconButtonVariant,
} from './IconButton.js';

export { Link } from './Link.js';
export type { LinkProps } from './Link.js';

export { Avatar } from './Avatar.js';
export type { AvatarProps, AvatarSize } from './Avatar.js';

export { Icon } from './Icon.js';
export type { IconProps } from './Icon.js';

export { SVG_PRIMITIVES, Svg } from './Svg.js';
export type { SvgPrimitives, SvgProps } from './Svg.js';

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
} from './forms.js';
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
} from './forms.js';

export { ScrollView, Sticky, VirtualList, registerVirtualListImpl } from './scroll.js';
export type { ScrollViewProps, StickyProps, VirtualListImpl, VirtualListProps } from './scroll.js';

export { FocusScope, Hide, LiveRegion, Overlay, Portal, Show, VisuallyHidden } from './overlay.js';
export type {
  FocusScopeProps,
  LiveRegionProps,
  OverlayProps,
  PortalProps,
  ShowHideProps,
  VisuallyHiddenProps,
} from './overlay.js';

export { Container } from './Container.js';
export type { ContainerProps } from './Container.js';

export { Image } from './Image.js';
export type { ImageProps } from './Image.js';

export { Pressable } from './Pressable.js';
export type { PressableProps } from './Pressable.js';

export { HStack, Stack, VStack } from './Stack.js';
export type { StackProps } from './Stack.js';

export { Text } from './Text.js';
export type { TextProps } from './Text.js';

export { Theme, ThemeProvider } from './Theme.js';
export type { ThemeProps, ThemeProviderProps } from './Theme.js';

export { ThemeContext, useTheme, useThemeChain, useThemeName } from './theme-context.js';
export type { ThemeContextValue } from './theme-context.js';

export { useThemeSetting } from './useThemeSetting.js';
export type {
  ResolvedTheme,
  ThemeMode,
  UseThemeSettingOptions,
  UseThemeSettingResult,
} from './useThemeSetting.js';

export {
  SSRStyleCollector,
  flushPendingCss,
  injectAtRules,
  injectPseudoRules,
} from './style-cache.js';
export type { AtRule, PseudoRule } from './style-cache.js';

export { CollectorContext, useActiveCollector } from './collector-context.js';
