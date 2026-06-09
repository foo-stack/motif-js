import {
  resolveAnimationToken,
  resolveStyles,
  resolveTransition,
  springToCssTiming,
  type AnimationValue,
  type MotionStyleProps,
  type MotionValueWideningOf,
  type StateStyleProps,
  type StyleProps,
  type StylePropName,
  type Theme,
  type TransitionValue,
} from '@usemotif/core';
import { createElement, type ReactNode } from 'react';
import { Animated, StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { BoxWithEnterNative } from './_box-enter.js';
import { BoxWithExitNative } from './_box-exit.js';
import { BoxWithMotionValuesNative } from './_box-motion-values.js';
import { splitMotionValueProps } from './_motion-bindings.js';
import { sanitizeNativeStyle } from './_native-style.js';
import { useContainerInfo } from './container-context.js';
import { useDirection } from './direction-context.js';
import { resolveResponsivePropsAtViewportAndContainer, useViewportWidth } from './responsive.js';
import { useTheme } from './theme-context.js';
import { useLayoutAnimation, type LayoutAnimationKind } from './use-layout-animation.js';
import { useDrag, type DragConstraints, type DragInfo, type DragSpringConfig } from './use-drag.js';

/**
 * Native Box props. Style props use the same schema as the web
 * renderer but are resolved to literal values via the active theme
 * (no CSS variables). Responsive object / array / DSL shapes resolve
 * against the current viewport width via `Dimensions`.
 *
 * Pseudo-state props (`_hover`, `_focus`, `_active`, `_disabled`) are
 * accepted on the type for cross-platform parity but are no-ops on
 * Box — RN `View` does not track pressed/hovered/focused state. To
 * apply state-driven styling on native, use `<Pressable>` (which uses
 * RN's children-as-style function form) or wire it up via a peer
 * gesture / animation library.
 *
 * Motion props (`enterStyle`, `exitStyle`, `transition`) drive entry
 * and exit animations through the active motion driver.
 * `enterStyle` runs an interpolation from the given values toward
 * the resolved base style on first mount; `exitStyle` runs the
 * reverse interpolation when the surrounding presence boundary
 * (`useExitTransitionNative` + `<ExitBoundary>`) flips into
 * `'exiting'` phase. `transition.duration` / `transition.easing`
 * size both animations.
 *
 * Without an exit-aware boundary in scope, `exitStyle` is silently
 * ignored — the boundary contract is opt-in (Dialog, Drawer, etc.
 * wire it up; standalone `<Box exitStyle={...}>` outside a boundary
 * pays no runtime cost).
 */
export type BoxProps = {
  -readonly [K in keyof StyleProps]?:
    | StyleProps[K]
    | ResponsiveValue<StyleProps[K]>
    | MotionValueWideningOf<K & StylePropName>;
} & StateStyleProps &
  MotionStyleProps &
  Omit<ViewProps, 'style'> & {
    style?: ViewStyle | readonly ViewStyle[];
    /**
     * Animate layout changes using FLIP. Set to `true` for both
     * position and size, `'position'` or `'size'` to limit axes. The
     * Box wraps itself with `useLayoutAnimation` so layout changes
     * tween smoothly via Animated.timing on the underlying transform
     * values.
     */
    layout?: boolean | 'position' | 'size';
    /**
     * Make the Box draggable. `true` enables free 2D drag; `'x'` /
     * `'y'` locks the drag to a single axis. Internally wires
     * `useDrag` and binds its `x` / `y` motion values to the Box's
     * transform shorthand props. PanResponder handlers are spread onto
     * the underlying View.
     */
    drag?: boolean | 'x' | 'y';
    /** Bounds for the drag offset. See `useDrag`'s `DragConstraints`. */
    dragConstraints?: DragConstraints;
    /**
     * Rubber-band elasticity past `dragConstraints`. `0` (default)
     * clamps hard; `1` lets the value extend freely.
     */
    dragElastic?: number;
    /**
     * Continue with velocity-driven momentum and spring-settle on
     * release. Pair with `dragTransition` to tune the spring.
     */
    dragMomentum?: boolean;
    /** Spring config for the release momentum / elastic-return settle. */
    dragTransition?: DragSpringConfig;
    /** Fires on drag start. */
    onDragStart?: (info: DragInfo) => void;
    /** Fires on every drag move. */
    onDrag?: (info: DragInfo) => void;
    /** Fires on drag release (before the momentum settle). */
    onDragEnd?: (info: DragInfo) => void;
    children?: ReactNode;
  };

type ResponsiveValue<V> =
  | ({ base?: V } & Record<string, V | undefined>)
  | readonly (V | undefined)[]
  | string;

/**
 * The atom of motif-js on native: a styled, theme-aware View.
 *
 * Token references (`bg="$colors.surface.base"`) resolve against the
 * active theme via React context. Responsive props (object / array /
 * DSL) resolve against the current viewport width via RN's
 * `Dimensions`, with the cascade going mobile-first (largest
 * breakpoint ≤ width wins, falling back to `base`).
 *
 * Container queries (`@<bp>` / `@<name>.<bp>` keys) are dropped at
 * the viewport stage; they're handled by the `<Container>` polyfill
 * which measures itself via `onLayout`.
 */
export function Box(props: BoxProps) {
  // Layout-animation dispatch sits at the very top — the wrapper owns
  // onLayout + the animated transform style the FLIP hook needs to
  // attach. The wrapper re-enters Box with layout stripped, so there's
  // no recursion.
  if (props.layout !== undefined && props.layout !== false) {
    return createElement(BoxWithLayoutNative, props);
  }

  // Drag dispatch — same pattern as layout. The wrapper runs `useDrag`
  // and re-enters Box with the panHandlers spread + the x/y motion
  // values bound to the transform shorthand. Drag props are stripped
  // on the inner pass so the dispatch is bounded.
  if (props.drag !== undefined && props.drag !== false) {
    return createElement(BoxWithDragNative, props);
  }

  // Pseudo-state props are accepted for cross-platform parity but
  // discarded here — RN `View` has no hovered/focused/pressed state.
  // The destructure ensures they don't leak through as DOM attributes.
  const {
    children,
    style: userStyle,
    _hover: _ignoredHover,
    _focus: _ignoredFocus,
    _active: _ignoredActive,
    _disabled: _ignoredDisabled,
    enterStyle,
    exitStyle,
    transition,
    animation,
    animateOnly,
    layout: _layout,
    drag: _drag,
    dragConstraints: _dragConstraints,
    dragElastic: _dragElastic,
    dragMomentum: _dragMomentum,
    dragTransition: _dragTransition,
    onDragStart: _onDragStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    ...rest
  } = props;
  void _ignoredHover;
  void _ignoredFocus;
  void _ignoredActive;
  void _ignoredDisabled;
  void animateOnly;

  // Pull motion-value-typed style props out before resolveStyles
  // runs — the resolver doesn't know how to handle a MotionValue and
  // would silently drop the slot.
  const { motionBindings, restWithoutMv } = splitMotionValueProps(rest as Record<string, unknown>);
  const hasMotionValues = motionBindings.length > 0;

  const theme = useTheme();
  const direction = useDirection();
  const width = useViewportWidth();
  const container = useContainerInfo();
  const flattened = resolveResponsivePropsAtViewportAndContainer(restWithoutMv, width, container);
  const { style: resolvedStyle, rest: passThrough } = resolveStyles(
    flattened as Record<string, unknown>,
    theme,
  );
  // Translate web-shaped CSS (box-shadow strings, literal transform strings,
  // web-only keys) into RN-native equivalents before it reaches
  // StyleSheet.create. See _native-style.ts.
  const baseStyle = sanitizeNativeStyle(resolvedStyle as Record<string, unknown>);
  // Inject the Yoga `direction` so logical props (`paddingInline`,
  // `insetInlineStart`, …) and `row` layouts resolve per writing
  // direction. Yoga inherits direction down the tree, but setting it
  // on every Box makes nested `<Direction>` overrides take effect.
  (baseStyle as Record<string, unknown>).direction = direction;

  // Motion-value path subsumes the entry/exit wrappers — the wrapper
  // composes the entry overlay with the MV-driven style under one
  // host so the two streams don't fight for the same style slot.
  if (hasMotionValues) {
    const { durationMs: enterDurationMs, easing: enterEasing } = parseEntryTiming(
      transition,
      animation,
      theme,
    );
    return createElement(
      BoxWithMotionValuesNative,
      {
        passThrough: passThrough as ViewProps,
        baseStyle: baseStyle as ViewStyle,
        userStyle,
        motionBindings,
        enterStyle,
        enterDurationMs,
        enterEasing,
        theme,
      },
      children,
    );
  }

  if (enterStyle !== undefined) {
    const { durationMs, easing } = parseEntryTiming(transition, animation, theme);
    return createElement(
      BoxWithEnterNative,
      {
        passThrough: passThrough as ViewProps,
        baseStyle: baseStyle as ViewStyle,
        userStyle,
        enterStyle,
        theme,
        durationMs,
        easing,
      },
      children,
    );
  }

  // `exitStyle` runs through the presence-boundary contract — Box
  // reads the boundary's phase via `usePresence()` inside
  // `BoxWithExitNative` and runs the driver only when phase flips to
  // `'exiting'`. Without an exit-aware parent, the descendant render
  // path is byte-equivalent to a non-motion render (driver hook
  // resolves to the no-op pair).
  if (exitStyle !== undefined) {
    const { durationMs, easing } = parseEntryTiming(transition, animation, theme);
    return createElement(
      BoxWithExitNative,
      {
        passThrough: passThrough as ViewProps,
        baseStyle: baseStyle as ViewStyle,
        userStyle,
        exitStyle,
        theme,
        durationMs,
        easing,
      },
      children,
    );
  }

  const sheet = StyleSheet.create({ box: baseStyle as ViewStyle });
  const finalStyle: ViewStyle[] =
    userStyle === undefined
      ? [sheet.box]
      : Array.isArray(userStyle)
        ? [sheet.box, ...(userStyle as ViewStyle[])]
        : [sheet.box, userStyle as ViewStyle];

  // `<Box layout>` re-enters here with the FLIP hook's `Animated.Value`
  // transforms in `userStyle`. Animated.Values only update when attached
  // to an `Animated` component, so a plain `View` would never animate
  // (and with useNativeDriver could throw). Render through `Animated.View`
  // whenever the resolved style carries one. The enter / motion-value /
  // exit dispatches above already use an animated host, so this only
  // affects the otherwise-plain layout path.
  const Host = (styleContainsAnimatedValue(finalStyle) ? Animated.View : View) as typeof View;
  return createElement(
    Host,
    {
      ...(passThrough as ViewProps),
      style: finalStyle,
    },
    children,
  );
}

/**
 * True when a resolved RN style (or style array) carries an
 * `Animated.Value` in its `transform` — the shape `useLayoutAnimation`
 * produces. Used to decide whether the host must be `Animated.View`.
 */
function styleContainsAnimatedValue(style: ViewStyle | ViewStyle[] | undefined): boolean {
  if (style === undefined || style === null) return false;
  const entries = Array.isArray(style) ? style : [style];
  for (const s of entries) {
    if (s === null || typeof s !== 'object') continue;
    const transform = (s as ViewStyle).transform;
    if (!Array.isArray(transform)) continue;
    for (const axis of transform) {
      if (axis === null || typeof axis !== 'object') continue;
      for (const key in axis) {
        if ((axis as Record<string, unknown>)[key] instanceof Animated.Value) return true;
      }
    }
  }
  return false;
}

/**
 * Extract `{ durationMs, easing }` from `transition` / `animation` for
 * the native motion driver. Resolution order:
 *
 * 1. `transition` (if set) — most specific, lowest-level instruction.
 *    Reuses `resolveTransition` from core (resolves token refs
 *    against the theme) and parses the resulting shorthand string.
 * 2. `animation="quick"` — looks up the named preset on the active
 *    theme. Spring tokens go through `springToCssTiming` so the
 *    default driver still has a usable `{ duration, easing }` pair
 *    (the Reanimated driver, when registered, can read the spring
 *    config directly off the prop on its own).
 * 3. Defaults — 200ms ease.
 *
 * The CSS-style `animation` resolution path on native is deliberately
 * not theme-cascade-aware (RN has no CSS variables); themes must be
 * read at render time via `useTheme()` and resolved here. That's
 * a one-shot resolution per-mount, consistent with the rest of the
 * native pipeline.
 */
function parseEntryTiming(
  transition: TransitionValue | undefined,
  animation: AnimationValue | undefined,
  theme: Theme | undefined,
): { durationMs: number; easing: string } {
  if (transition !== undefined) {
    const first = Array.isArray(transition) ? transition[0] : transition;
    const resolved = first === undefined ? undefined : resolveTransition(first, theme);
    if (resolved !== undefined) {
      const tokens = resolved.split(/\s+/).filter(Boolean);
      const duration = tokens[1] ?? '200ms';
      const easing = tokens[2] ?? 'ease';
      return { durationMs: parseDurationMs(duration), easing };
    }
  }
  if (animation !== undefined) {
    // Object form: native has no @keyframes-driven animation, so the
    // entry driver just borrows the `duration` / `easing` slots.
    if (typeof animation === 'object') {
      const duration = animation.duration ?? '200ms';
      const easing = animation.easing ?? 'ease';
      return {
        durationMs: parseDurationMs(resolveTokenStringIfNeeded(duration, theme, 'durations')),
        easing: resolveTokenStringIfNeeded(easing, theme, 'easings'),
      };
    }
    const token = resolveAnimationToken(animation, theme);
    if (token !== undefined) {
      // For springs, fall back to the CSS approximation so the JS-
      // thread Animated driver has something to work with. Reanimated
      // driver consumers wanting true spring semantics should read
      // the prop directly in their driver.
      const timing = token.type === 'spring' ? springToCssTiming(token) : token;
      const duration = timing.duration ?? '200ms';
      const easing = timing.easing ?? 'ease';
      return {
        durationMs: parseDurationMs(resolveTokenStringIfNeeded(duration, theme, 'durations')),
        easing: resolveTokenStringIfNeeded(easing, theme, 'easings'),
      };
    }
  }
  return { durationMs: 200, easing: 'ease' };
}

/** Token-ref-aware passthrough for animation timing fields. Falls back
 * to the input string if resolution fails. */
function resolveTokenStringIfNeeded(
  value: string,
  theme: Theme | undefined,
  scale: 'durations' | 'easings',
): string {
  if (!value.startsWith('$')) return value;
  if (theme === undefined) return value;
  // resolveTransition gives us the timing-resolution path through
  // core's token resolver; reuse it via a synthetic single-prop
  // transition entry so token refs collapse to literal values.
  const resolved = resolveTransition(
    { [scale === 'durations' ? 'duration' : 'easing']: value },
    theme,
  );
  if (resolved === undefined) return value;
  const tokens = resolved.split(/\s+/).filter(Boolean);
  return scale === 'durations' ? (tokens[1] ?? value) : (tokens[2] ?? value);
}

function parseDurationMs(value: string): number {
  const ms = /^([\d.]+)ms$/.exec(value);
  if (ms !== null) return Number(ms[1]);
  const s = /^([\d.]+)s$/.exec(value);
  if (s !== null) return Number(s[1]) * 1000;
  return 200;
}

/**
 * Internal helper exposing Box's style resolution for primitives that
 * need to apply Box-level styling without rendering an extra View
 * wrapper (e.g. `ScrollView` puts the resolved style on RN's
 * `contentContainerStyle` so `Sticky` children can be direct children
 * of the RN ScrollView and their indices flow into
 * `stickyHeaderIndices`).
 */
export function useResolvedBoxStyle(
  rest: Omit<BoxProps, 'children' | 'style'>,
  userStyle: BoxProps['style'],
): {
  style: ViewStyle[];
  passThrough: Record<string, unknown>;
} {
  const theme = useTheme();
  const direction = useDirection();
  const width = useViewportWidth();
  const container = useContainerInfo();

  const flattened = resolveResponsivePropsAtViewportAndContainer(rest, width, container);
  const { style: resolvedRaw, rest: passThrough } = resolveStyles(
    flattened as Record<string, unknown>,
    theme,
  );
  const resolved = sanitizeNativeStyle(resolvedRaw as Record<string, unknown>);
  resolved.direction = direction;

  const sheet = StyleSheet.create({ box: resolved as ViewStyle });
  const finalStyle: ViewStyle[] =
    userStyle === undefined
      ? [sheet.box]
      : Array.isArray(userStyle)
        ? [sheet.box, ...(userStyle as ViewStyle[])]
        : [sheet.box, userStyle as ViewStyle];

  return { style: finalStyle, passThrough };
}

/**
 * Native counterpart of `BoxWithLayout`. Drives a FLIP via
 * `useLayoutAnimation` on RN — the hook returns an `onLayout` handler
 * and a `style` carrying live `Animated.Value`s for translateX /
 * translateY / scaleX / scaleY. We compose the consumer's `style`
 * with the hook's style and forward `onLayout` on top of the
 * stripped Box. Recursion is bounded because the inner Box call
 * omits `layout`.
 */
function BoxWithLayoutNative(props: BoxProps) {
  const { layout, style: userStyle, ...rest } = props;
  const kind: LayoutAnimationKind =
    layout === true || layout === undefined ? 'all' : (layout as LayoutAnimationKind);
  const { onLayout, style } = useLayoutAnimation({ kind });

  // Compose user style with the animation transform. Native style can
  // be an array — preserve that shape so consumers' arrays still
  // flatten as RN expects.
  const composedStyle: ViewStyle | ViewStyle[] =
    userStyle === undefined
      ? (style as ViewStyle)
      : Array.isArray(userStyle)
        ? ([...(userStyle as ViewStyle[]), style as ViewStyle] as ViewStyle[])
        : ([userStyle as ViewStyle, style as ViewStyle] as ViewStyle[]);

  return <Box {...(rest as BoxProps)} style={composedStyle} onLayout={onLayout} />;
}

/**
 * Native counterpart of `BoxWithDrag`. Pulls drag props out of the
 * surface, runs `useDrag`, then re-enters Box with the panHandlers
 * spread on top + the x/y motion values bound to the transform
 * shorthand. Drag props are stripped on the inner pass so the
 * dispatch is bounded.
 */
function BoxWithDragNative(props: BoxProps) {
  const {
    drag,
    dragConstraints,
    dragElastic,
    dragMomentum,
    dragTransition,
    onDragStart,
    onDrag,
    onDragEnd,
    ...rest
  } = props;

  const axis = drag === 'x' || drag === 'y' ? drag : 'both';
  const { dragProps, Wrapper, x, y } = useDrag({
    axis,
    ...(dragConstraints !== undefined ? { constraints: dragConstraints } : {}),
    ...(dragElastic !== undefined ? { dragElastic } : {}),
    ...(dragMomentum !== undefined ? { dragMomentum } : {}),
    ...(dragTransition !== undefined ? { dragTransition } : {}),
    ...(onDragStart !== undefined ? { onDragStart } : {}),
    ...(onDrag !== undefined ? { onDrag } : {}),
    ...(onDragEnd !== undefined ? { onDragEnd } : {}),
  });

  // The driver-routed path (e.g. reanimated + gesture-handler) returns
  // a `Wrapper` host that must mount around the dragable element so
  // the gesture system attaches correctly. PanResponder paths return a
  // passthrough Fragment so this stays a no-op for the default driver.
  return (
    <Wrapper>
      <Box
        {...(rest as BoxProps)}
        {...(dragProps as Record<string, unknown>)}
        x={x as never}
        y={y as never}
      />
    </Wrapper>
  );
}
