import { type ReactNode } from 'react';
import { Text } from 'react-native';

/**
 * Wrap a bare string/number so it can sit inside a `View` / `Pressable`
 * without tripping React Native's "Text strings must be rendered within
 * a `<Text>` component" invariant.
 *
 * The default renderers for options, empty states, toasts, and nav items
 * accept a `ReactNode` (or a `string`) and drop it straight into a host
 * View. On the web that's harmless; on native a raw string child of a
 * non-`Text` host throws and takes the whole screen down. Routing those
 * values through here fixes the out-of-the-box crash while leaving any
 * consumer-supplied element untouched — an element already owns its own
 * `Text` wrapping, and `undefined` / `null` pass through as nothing.
 *
 * Native-only: this module imports `react-native`, so it must only be
 * imported from `*.native.tsx` files (never a web bundle).
 */
export function nativeText(value: ReactNode): ReactNode {
  return typeof value === 'string' || typeof value === 'number' ? <Text>{value}</Text> : value;
}
