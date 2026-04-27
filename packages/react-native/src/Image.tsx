import { resolveStyles } from '@motif-js/core';
import { createElement, useState, type ReactNode } from 'react';
import {
  Image as RNImage,
  StyleSheet,
  View,
  type ImageStyle,
  type ImageProps as RNImageProps,
  type ViewStyle,
} from 'react-native';
import { useContainerInfo } from './container-context.js';
import { resolveResponsivePropsAtViewportAndContainer, useViewportWidth } from './responsive.js';
import { useTheme } from './theme-context.js';

type ImageStatus = 'loading' | 'loaded' | 'error';

export interface ImageProps extends Omit<RNImageProps, 'source' | 'style'> {
  /** Image URL. Translated to RN's `source={{ uri }}`. */
  src: string;
  /** Alt text. Stored as `accessibilityLabel` on RN. Required so
   * decorative images opt in via empty string. */
  alt: string;
  /** ReactNode shown while the image is loading. Mirrors web. */
  placeholder?: ReactNode;
  /** ReactNode shown when the image fails to load. Falls back to
   * `placeholder` when not given. */
  fallback?: ReactNode;
  /** Style props at the React level. */
  style?: ImageStyle | readonly ImageStyle[];
  // Style props (every Box-style prop) — index signature so consumers
  // can pass `w` / `h` / `borderRadius` etc. without each prop being
  // explicitly enumerated.
  [styleProp: string]: unknown;
}

/**
 * Native image primitive. Wraps RN's `Image` with two render paths
 * matching the web Image:
 *
 * - **Simple** (no placeholder/fallback): renders `<Image>` directly,
 *   all Box style props applied.
 * - **Wrapped** (placeholder or fallback set): renders a positioned
 *   `View` wrapper with the size/box-style props on the wrapper; the
 *   actual `<Image>` sits inside at `width: '100%' / height: '100%'`
 *   and fades in (`opacity`) on load. Overlay (`placeholder` during
 *   load, `fallback` on error) renders absolutely-positioned across
 *   the wrapper.
 *
 * @example
 *
 * ```tsx
 * <Image
 *   src="https://example.com/avatar.jpg"
 *   alt="User avatar"
 *   w={64} h={64}
 *   borderRadius="$full"
 *   placeholder={<Box bg="$colors.surface.muted" w="100%" h="100%" />}
 * />
 * ```
 */
export function Image(props: ImageProps) {
  if (props.placeholder === undefined && props.fallback === undefined) {
    return <SimpleImage {...props} />;
  }
  return <WrappedImage {...props} />;
}

function SimpleImage(props: ImageProps) {
  const { src, alt, placeholder: _ph, fallback: _fb, style: userStyle, ...rest } = props;
  const theme = useTheme();
  const width = useViewportWidth();
  const container = useContainerInfo();
  const flattened = resolveResponsivePropsAtViewportAndContainer(rest, width, container);
  const { style: resolved, rest: passThrough } = resolveStyles(
    flattened as Record<string, unknown>,
    theme,
  );
  const sheet = StyleSheet.create({ img: resolved as ImageStyle });
  const finalStyle: ImageStyle[] =
    userStyle === undefined
      ? [sheet.img]
      : Array.isArray(userStyle)
        ? [sheet.img, ...(userStyle as ImageStyle[])]
        : [sheet.img, userStyle as ImageStyle];

  return createElement(RNImage, {
    ...(passThrough as RNImageProps),
    source: { uri: src },
    accessibilityLabel: alt,
    style: finalStyle,
  });
}

function WrappedImage(props: ImageProps) {
  const { src, alt, placeholder, fallback, style: _userStyle, ...rest } = props;
  const theme = useTheme();
  const width = useViewportWidth();
  const container = useContainerInfo();
  const [status, setStatus] = useState<ImageStatus>('loading');

  const flattened = resolveResponsivePropsAtViewportAndContainer(rest, width, container);
  const { style: wrapperStyle, rest: passThrough } = resolveStyles(
    flattened as Record<string, unknown>,
    theme,
  );

  const overlay =
    status === 'loading' ? placeholder : status === 'error' ? (fallback ?? placeholder) : null;

  const sheet = StyleSheet.create({
    wrapper: { ...(wrapperStyle as ViewStyle), position: 'relative', overflow: 'hidden' },
    img: { width: '100%', height: '100%', opacity: status === 'loaded' ? 1 : 0 } as ImageStyle,
    overlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } as ViewStyle,
  });

  return createElement(
    View,
    { ...(passThrough as Record<string, unknown>), style: [sheet.wrapper] },
    overlay !== null && overlay !== undefined
      ? createElement(View, { style: [sheet.overlay] }, overlay)
      : null,
    createElement(RNImage, {
      source: { uri: src },
      accessibilityLabel: alt,
      style: [sheet.img],
      onLoad: () => setStatus('loaded'),
      onError: () => setStatus('error'),
    }),
  );
}
