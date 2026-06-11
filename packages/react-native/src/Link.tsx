import { type ReactElement, type ReactNode } from 'react';
import { Linking, type GestureResponderEvent } from 'react-native';
import { Pressable, type PressableProps } from './Pressable.js';
import { Text } from './Text.js';

export interface LinkProps extends Omit<PressableProps, 'children'> {
  /** URL the link points at. Tapped via `Linking.openURL`. */
  href: string;
  /** Visual underline mode. Native respects this via the Text wrapper. */
  underline?: 'hover' | 'always' | 'never';
  /** Link text color. Defaults to `$colors.action.primary.bg`. Applied
   * to the label `<Text>` (RN Views don't cascade color). */
  color?: string;
  children?: ReactNode;
}

/**
 * Native link primitive. Wraps Pressable so the same a11y plumbing
 * applies; tapping the link calls `Linking.openURL(href)`. The label
 * renders inside `<Text>` so font-size / color / underline cascade
 * correctly. The web sibling uses `<a href>` directly; both share
 * the same prop shape so cross-platform code stays portable.
 */
export function Link({
  href,
  underline = 'always',
  children,
  color,
  onPress,
  ...rest
}: LinkProps): ReactElement {
  type Handler = (event: GestureResponderEvent) => void;
  const handle: Handler = (e) => {
    if (typeof onPress === 'function') (onPress as Handler)(e);
    if (!e.defaultPrevented) {
      void Linking.openURL(href);
    }
  };

  const textDecorationLine = underline === 'never' ? 'none' : 'underline';

  // RN has no `inherit` color keyword and `<Text>` never inherits color
  // from a parent View, so the link color must land on the label `<Text>`
  // itself (the web sibling gets it for free via the cascade). The
  // Pressable wrapper carries no color.
  return (
    <Pressable accessibilityRole="link" onPress={handle} {...rest}>
      <Text color={color ?? '$colors.action.primary.bg'} style={{ textDecorationLine }}>
        {children}
      </Text>
    </Pressable>
  );
}
