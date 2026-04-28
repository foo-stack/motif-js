import type { ComponentType, ElementType, ReactElement, ReactNode } from 'react';
import { Box } from './Box.js';

/**
 * Platform-portable SVG primitives passed to the `render` prop on
 * `Icon`. Mirrors the web definition; on native each entry is a
 * `react-native-svg` component when that peer dep is installed, and
 * `null` otherwise.
 */
export interface SvgPrimitives {
  readonly Path: ElementType;
  readonly Circle: ElementType;
  readonly Rect: ElementType;
  readonly Line: ElementType;
  readonly Polygon: ElementType;
  readonly Polyline: ElementType;
  readonly Ellipse: ElementType;
  readonly G: ElementType;
}

interface ReactNativeSvgModule {
  readonly default?: ComponentType<Record<string, unknown>>;
  readonly Svg?: ComponentType<Record<string, unknown>>;
  readonly Path: ElementType;
  readonly Circle: ElementType;
  readonly Rect: ElementType;
  readonly Line: ElementType;
  readonly Polygon: ElementType;
  readonly Polyline: ElementType;
  readonly Ellipse: ElementType;
  readonly G: ElementType;
}

/**
 * Best-effort optional require. In Metro / CommonJS environments the
 * global `require` is available; in pure-ESM bundlers it isn't, and
 * we silently fall back to `null`. Either way the surface stays the
 * same: when the peer dep is present, native SVG renders for real;
 * when it isn't, glyphs render an empty Box of the right size.
 */
function tryRequire<T>(id: string): T | null {
  try {
    const r =
      typeof globalThis !== 'undefined' &&
      typeof (globalThis as { require?: (id: string) => unknown }).require === 'function'
        ? (globalThis as { require: (id: string) => unknown }).require
        : typeof require !== 'undefined'
          ? require
          : null;
    if (r === null) return null;
    return r(id) as T;
  } catch {
    return null;
  }
}

const nativeSvg = tryRequire<ReactNativeSvgModule>('react-native-svg');

/**
 * The `react-native-svg` `Svg` component when the peer dep is
 * installed, `null` otherwise. Exposed for tests and for callers
 * that want to feature-detect native SVG support.
 */
export const NATIVE_SVG_COMPONENT: ComponentType<Record<string, unknown>> | null =
  nativeSvg !== null ? (nativeSvg.default ?? nativeSvg.Svg ?? null) : null;

/**
 * Native `SvgPrimitives` populated from `react-native-svg`. `null`
 * when the peer dep isn't installed — `Icon` falls back to a sized
 * `Box` placeholder in that case.
 */
export const SVG_PRIMITIVES: SvgPrimitives | null =
  nativeSvg !== null
    ? {
        Path: nativeSvg.Path,
        Circle: nativeSvg.Circle,
        Rect: nativeSvg.Rect,
        Line: nativeSvg.Line,
        Polygon: nativeSvg.Polygon,
        Polyline: nativeSvg.Polyline,
        Ellipse: nativeSvg.Ellipse,
        G: nativeSvg.G,
      }
    : null;

/**
 * Native Svg primitive — auto-uses `react-native-svg` when the peer
 * dep is installed, and falls back to a sized `Box` shell otherwise.
 *
 * Pass `SvgComponent={SVG}` explicitly to force a particular host
 * component (useful in tests, or when wiring a custom SVG renderer).
 */
export interface SvgProps {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  viewBox?: string;
  fill?: string;
  stroke?: string;
  /**
   * Override the SVG host component. When omitted, motif uses the
   * detected `react-native-svg` `Svg` if available, otherwise a
   * sized Box.
   */
  SvgComponent?: ComponentType<Record<string, unknown>>;
  children?: ReactNode;
}
export function Svg({
  size = 16,
  width,
  height,
  viewBox = '0 0 24 24',
  fill = 'none',
  stroke = 'currentColor',
  SvgComponent,
  children,
}: SvgProps): ReactElement {
  const w = width ?? size;
  const h = height ?? size;
  const Component = SvgComponent ?? NATIVE_SVG_COMPONENT;
  if (Component !== null) {
    return (
      <Component width={w} height={h} viewBox={viewBox} fill={fill} stroke={stroke}>
        {children}
      </Component>
    );
  }
  return (
    <Box
      style={{
        width: typeof w === 'number' ? w : undefined,
        height: typeof h === 'number' ? h : undefined,
      }}
    >
      {children}
    </Box>
  );
}
