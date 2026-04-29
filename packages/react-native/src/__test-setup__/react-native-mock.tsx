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
export const TextInput = makeHost('TextInput', 'input');
export const Modal = makeHost('Modal', 'div', true);

/**
 * ScrollView shim — surfaces the `stickyHeaderIndices` prop as a
 * `data-sticky-indices` attribute on the rendered host so tests can
 * verify the index list motif's `<ScrollView>` computed from its
 * `<Sticky>` children.
 */
export const ScrollView: ComponentType<HostProps> = (props: HostProps) => {
  const { children, style, contentContainerStyle, stickyHeaderIndices, testID, ...rest } = props;
  const styleAttr = style === undefined ? null : JSON.stringify(style);
  const contentStyleAttr =
    contentContainerStyle === undefined ? null : JSON.stringify(contentContainerStyle);
  const stickyAttr = Array.isArray(stickyHeaderIndices)
    ? JSON.stringify(stickyHeaderIndices)
    : null;
  return createElement(
    'div',
    {
      'data-motif-host': 'ScrollView',
      ...(styleAttr === null ? {} : { 'data-motif-style': styleAttr }),
      ...(contentStyleAttr === null ? {} : { 'data-motif-content-style': contentStyleAttr }),
      ...(stickyAttr === null ? {} : { 'data-sticky-indices': stickyAttr }),
      ...(testID === undefined ? {} : { testID }),
      ...(rest as Record<string, unknown>),
    },
    children,
  );
};
ScrollView.displayName = 'ScrollView';

export const Linking = {
  openURL: (_url: string): Promise<void> => Promise.resolve(),
  canOpenURL: (_url: string): Promise<boolean> => Promise.resolve(true),
};

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

// `Appearance` mock — used by `useThemeSetting`. Defaults to `'light'`;
// tests can flip via `__setColorScheme('dark')`.
type ColorScheme = 'light' | 'dark' | null;
let mockColorScheme: ColorScheme = 'light';
const appearanceListeners = new Set<(p: { colorScheme: ColorScheme }) => void>();
export const Appearance = {
  getColorScheme(): ColorScheme {
    return mockColorScheme;
  },
  addChangeListener(handler: (p: { colorScheme: ColorScheme }) => void) {
    appearanceListeners.add(handler);
    return {
      remove() {
        appearanceListeners.delete(handler);
      },
    };
  },
};

/** Test-only: change the mock OS color scheme and notify listeners. */
export function __setColorScheme(next: ColorScheme): void {
  mockColorScheme = next;
  for (const fn of appearanceListeners) {
    fn({ colorScheme: next });
  }
}

/**
 * `Animated` mock — minimal stub used by the default motion driver.
 * `Animated.Value` exposes `addListener` / `removeListener`, and
 * `Animated.timing(...).start()` synchronously notifies all listeners
 * with `{ value: 1 }` so tests don't depend on rAF timing. For
 * fine-grained progress assertions, tests register the noop driver or
 * a fake driver instead of relying on Animated's behaviour.
 */
class AnimatedValue {
  private listeners = new Map<string, (e: { value: number }) => void>();
  private nextId = 0;
  private current: number;

  constructor(initial: number) {
    this.current = initial;
  }

  addListener(fn: (e: { value: number }) => void): string {
    const id = String(this.nextId++);
    this.listeners.set(id, fn);
    return id;
  }

  removeListener(id: string): void {
    this.listeners.delete(id);
  }

  __set(value: number): void {
    this.current = value;
    for (const fn of this.listeners.values()) {
      fn({ value });
    }
  }
}

interface TimingHandle {
  start(callback?: (result: { finished: boolean }) => void): void;
}

export const Animated = {
  Value: AnimatedValue,
  timing(value: AnimatedValue, config: { toValue: number; duration: number }): TimingHandle {
    return {
      start(callback?: (result: { finished: boolean }) => void) {
        // Fire one tick immediately at full progress. Tests that need
        // partial-progress steps poke `value.__set(t)` directly.
        value.__set(config.toValue);
        callback?.({ finished: true });
      },
    };
  },
};

const passthrough = (t: number): number => t;
export const Easing = {
  linear: passthrough,
  ease: passthrough,
  in: (_easing: (t: number) => number): ((t: number) => number) => passthrough,
  out: (_easing: (t: number) => number): ((t: number) => number) => passthrough,
  inOut: (_easing: (t: number) => number): ((t: number) => number) => passthrough,
};
