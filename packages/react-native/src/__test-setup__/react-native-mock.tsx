/**
 * Minimal `react-native` shim for vitest.
 *
 * The real RN package ships Flow-syntax JS that vitest's parser
 * rejects, AND React 19's `react-test-renderer` is effectively broken
 * for arbitrary host components. The fix that works on both fronts:
 * render motif's native View / Text as plain `<div>` / `<span>` host
 * elements with a `data-motif-host` attribute identifying which RN
 * component they're standing in for. Tests run under jsdom and query
 * by that attribute.
 *
 * If a future test needs another RN export (e.g. `Pressable`,
 * `Image`, `Dimensions`), add it here so the mock stays scoped to
 * what the tests actually touch.
 */

import { createElement, useLayoutEffect, type ComponentType, type ReactNode } from 'react';

interface HostProps {
  children?: ReactNode;
  style?: unknown;
  onLayout?: (event: {
    nativeEvent: { layout: { width: number; height: number; x: number; y: number } };
  }) => void;
  testID?: string;
  [key: string]: unknown;
}

/**
 * Per-testID width registry — tests call `__setLayoutWidth(testID, w)`
 * before rendering; the View mock fires `onLayout` with the matching
 * width via `useLayoutEffect` once the element has mounted. This
 * sidesteps jsdom's lack of a real layout pass.
 */
const mockLayoutWidths = new Map<string, number>();

/** Test-only: register a width to fire on the next `onLayout` for the
 * given testID. Subsequent `__setLayoutWidth` calls re-register and
 * the next render's `onLayout` picks them up. */
export function __setLayoutWidth(testID: string, width: number): void {
  mockLayoutWidths.set(testID, width);
}

function makeHost(name: string, htmlTag: string, withLayout = false): ComponentType<HostProps> {
  const Host = (props: HostProps) => {
    const { children, style, onLayout, testID, ...rest } = props;
    const styleAttr = style === undefined ? null : JSON.stringify(style);

    // Hooks must be called unconditionally — call useLayoutEffect for
    // every render of this host. The effect body bails out unless the
    // host actually wants layout firing.
    useLayoutEffect(() => {
      if (!withLayout || typeof onLayout !== 'function') return;
      const width =
        testID !== undefined && mockLayoutWidths.has(testID) ? mockLayoutWidths.get(testID)! : 0;
      onLayout({ nativeEvent: { layout: { x: 0, y: 0, width, height: 0 } } });
    }, [onLayout, testID]);

    return createElement(
      htmlTag,
      {
        'data-motif-host': name,
        ...(styleAttr === null ? {} : { 'data-motif-style': styleAttr }),
        ...(testID === undefined ? {} : { testID }),
        ...rest,
      },
      children,
    );
  };
  Host.displayName = name;
  return Host;
}

// View fires `onLayout` automatically (used by Container).
export const View = makeHost('View', 'div', true);
export const SafeAreaView = makeHost('SafeAreaView', 'div', true);
export const Text = makeHost('Text', 'span');
export const Image = makeHost('Image', 'img');

/**
 * Pressable shim — RN's Pressable accepts a function-as-style
 * `(state) => styles`. The shim invokes that with a synthetic
 * `{ pressed: false }` to produce the default-state style array
 * (which is what jsdom queries against). Tests that need other
 * states (`hovered`, `focused`, `pressed`) opt in via the
 * `data-motif-pressable-state` attribute set on the rendered host.
 */
export const Pressable: ComponentType<HostProps> = (props: HostProps) => {
  const { children, style, onPress, ...rest } = props;
  const stateRaw =
    typeof rest['data-motif-pressable-state'] === 'string'
      ? (JSON.parse(rest['data-motif-pressable-state'] as string) as Record<string, boolean>)
      : { pressed: false };
  const { 'data-motif-pressable-state': _omit, ...passThrough } = rest;
  const resolvedStyle = typeof style === 'function' ? style(stateRaw) : style;
  const styleAttr = resolvedStyle === undefined ? null : JSON.stringify(resolvedStyle);
  // Translate RN's `onPress` → DOM's `onClick` so jsdom's click()
  // dispatches reach the consumer-supplied handler. RN's
  // GestureResponderEvent shape is loose enough that passing the DOM
  // MouseEvent through is fine for tests.
  const onClick =
    typeof onPress === 'function'
      ? (e: unknown) => (onPress as (e: unknown) => void)(e)
      : undefined;
  return createElement(
    'button',
    {
      'data-motif-host': 'Pressable',
      ...(styleAttr === null ? {} : { 'data-motif-style': styleAttr }),
      ...(onClick === undefined ? {} : { onClick }),
      ...(passThrough as Record<string, unknown>),
    },
    children,
  );
};
Pressable.displayName = 'Pressable';

export const StyleSheet = {
  create<T extends Record<string, unknown>>(styles: T): T {
    return styles;
  },
  flatten(style: unknown): unknown {
    if (Array.isArray(style)) {
      return style.reduce<Record<string, unknown>>(
        (acc, s) => Object.assign(acc, (s as Record<string, unknown>) ?? {}),
        {},
      );
    }
    return style ?? {};
  },
};

// Type re-exports — empty to keep consumer-side types alignable with
// RN's `ViewStyle` / `ViewProps` shapes without dragging in RN's Flow
// source. eslint disabled inline since the empty body is intentional.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ViewStyle {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ViewProps {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TextStyle {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TextProps {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ImageStyle {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ImageProps {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PressableProps {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GestureResponderEvent {}
// Layout event shape used by `View.onLayout` callbacks.
export interface LayoutChangeEvent {
  nativeEvent: {
    layout: { x: number; y: number; width: number; height: number };
  };
}

// `Dimensions` mock — minimal API used by the viewport-driven
// resolver. Returns a fixed 360×640 size by default so tests are
// deterministic. Tests can override via `__setDimensions(width)`.
let mockWidth = 360;
let mockHeight = 640;
const dimensionsListeners = new Set<(d: { window: { width: number; height: number } }) => void>();
export const Dimensions = {
  get(_dim: 'window' | 'screen' = 'window') {
    return { width: mockWidth, height: mockHeight, scale: 1, fontScale: 1 };
  },
  addEventListener(
    _name: 'change',
    handler: (d: { window: { width: number; height: number } }) => void,
  ) {
    dimensionsListeners.add(handler);
    return {
      remove() {
        dimensionsListeners.delete(handler);
      },
    };
  },
};

/** Test-only: change the mock viewport width and notify listeners. */
export function __setDimensions(width: number, height = 640): void {
  mockWidth = width;
  mockHeight = height;
  for (const fn of dimensionsListeners) {
    fn({ window: { width: mockWidth, height: mockHeight } });
  }
}
