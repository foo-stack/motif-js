/**
 * @motif-js/react-native — React Native implementations of motif-js
 * primitives. Same prop schema as `@motif-js/react-web`; resolves
 * styles to literal values via JS-context theming (no CSS variables).
 */

export const PACKAGE_NAME = '@motif-js/react-native';

export { Box } from './Box.js';
export type { BoxProps } from './Box.js';

export { Button } from './Button.js';
export type { ButtonIntent, ButtonProps, ButtonSize, ButtonVariant } from './Button.js';

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

export { Svg } from './Svg.js';
export type { SvgProps } from './Svg.js';

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

export { ScrollView, Sticky, VirtualList } from './scroll.js';
export type { ScrollViewProps, StickyProps, VirtualListProps } from './scroll.js';

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
export type { ContainerProps, ContainerStyle } from './Container.js';

export { ContainerContext, useContainerInfo } from './container-context.js';
export type { ContainerContextValue } from './container-context.js';

export { HStack, Stack, VStack } from './Stack.js';
export type { StackProps } from './Stack.js';

export { Text } from './Text.js';
export type { TextProps } from './Text.js';

export { Pressable } from './Pressable.js';
export type { PressableProps } from './Pressable.js';

export { Image } from './Image.js';
export type { ImageProps } from './Image.js';

export { Theme, ThemeProvider } from './Theme.js';
export type { ThemeProps, ThemeProviderProps } from './Theme.js';

export { ThemeContext, useTheme, useThemeName } from './theme-context.js';
export type { ThemeContextValue } from './theme-context.js';
