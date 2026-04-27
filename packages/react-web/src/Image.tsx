import { useState, type ReactNode, type SyntheticEvent } from 'react';
import { Box, type BoxProps } from './Box.js';

/**
 * Image load state. `loading` while the network request is in flight,
 * `loaded` after `onLoad` fires, `error` after `onError` fires (or when
 * `src` is missing).
 */
type ImageStatus = 'loading' | 'loaded' | 'error';

export interface ImageProps extends Omit<BoxProps, 'children'> {
  /** Image URL. */
  src: string;
  /** Alt text. Required for accessibility — pass an empty string for
   * decorative images. */
  alt: string;
  /**
   * Content to render in place of the image while it's loading. Any
   * ReactNode — a colored Box, a skeleton, a low-res blur-up, etc.
   *
   * If absent, the image renders directly with no overlay.
   */
  placeholder?: ReactNode;
  /**
   * Content to render if the image fails to load. Falls back to
   * {@link placeholder} when not specified, then to nothing.
   */
  fallback?: ReactNode;
  /** `<img>` `loading` attribute (`'lazy' | 'eager'`). */
  loading?: 'lazy' | 'eager';
  /** `<img>` `decoding` attribute. */
  decoding?: 'async' | 'sync' | 'auto';
  /** `srcset` for responsive images. */
  srcSet?: string;
  /** `sizes` for responsive images. */
  sizes?: string;
  /** Fired when the image successfully loads. */
  onLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  /** Fired when the image fails to load. */
  onError?: (event: SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * Cross-platform image primitive. Wraps `<img>` on web with optional
 * placeholder + fallback overlays for loading and error states.
 *
 * @example
 *
 * ```tsx
 * <Image
 *   src="/avatar.jpg"
 *   alt="User avatar"
 *   w={64}
 *   h={64}
 *   borderRadius="$full"
 *   objectFit="cover"
 *   placeholder={<Box bg="$colors.surface.muted" w="100%" h="100%" />}
 *   fallback={<Box bg="$colors.surface.muted" w="100%" h="100%" />}
 * />
 * ```
 *
 * **Simple case** (no placeholder / fallback): renders an `<img>` directly,
 * with all Box style props applied to the image element.
 *
 * **Wrapped case** (placeholder or fallback set): renders a Box wrapper
 * with the size / box-style props on the wrapper; the `<img>` sits inside
 * absolutely-positioned and fades in once loaded. Placeholder shows during
 * `loading`; fallback (or placeholder, if no fallback) shows on `error`.
 */
export function Image(props: ImageProps) {
  const {
    src,
    alt,
    placeholder,
    fallback,
    loading,
    decoding,
    srcSet,
    sizes,
    onLoad,
    onError,
    ...rest
  } = props;

  // Simple case — no overlay needed; emit a plain styled <img>.
  if (placeholder === undefined && fallback === undefined) {
    return (
      <Box
        as="img"
        // Native `<img>` attributes thread through Box's pass-through.
        {...({ src, alt, srcSet, sizes, loading, decoding } as Record<string, unknown>)}
        {...(onLoad !== undefined ? { onLoad } : {})}
        {...(onError !== undefined ? { onError } : {})}
        {...rest}
      />
    );
  }

  return <ImageWithOverlay {...props} />;
}

function ImageWithOverlay(props: ImageProps) {
  const {
    src,
    alt,
    placeholder,
    fallback,
    loading,
    decoding,
    srcSet,
    sizes,
    onLoad,
    onError,
    ...rest
  } = props;
  const [status, setStatus] = useState<ImageStatus>('loading');

  const overlay =
    status === 'loading' ? placeholder : status === 'error' ? (fallback ?? placeholder) : null;

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    setStatus('loaded');
    onLoad?.(event);
  };
  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    setStatus('error');
    onError?.(event);
  };

  return (
    <Box {...rest} position="relative" overflow="hidden">
      {overlay !== null && overlay !== undefined ? (
        <Box position="absolute" top={0} right={0} bottom={0} left={0}>
          {overlay}
        </Box>
      ) : null}
      <Box
        as="img"
        {...({ src, alt, srcSet, sizes, loading, decoding } as Record<string, unknown>)}
        display="block"
        w="100%"
        h="100%"
        opacity={status === 'loaded' ? 1 : 0}
        onLoad={handleLoad}
        onError={handleError}
      />
    </Box>
  );
}
