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

import { createElement, type ComponentType, type ReactNode } from 'react';

interface HostProps {
  children?: ReactNode;
  style?: unknown;
  [key: string]: unknown;
}

function makeHost(name: string, htmlTag: string): ComponentType<HostProps> {
  const Host = (props: HostProps) => {
    const { children, style, ...rest } = props;
    // Stash the RN-shaped style array on a data attribute so tests
    // can read the resolved values without depending on jsdom's CSS
    // parsing (which rejects unknown camelCase props on `style`).
    const styleAttr = style === undefined ? null : JSON.stringify(style);
    return createElement(
      htmlTag,
      {
        'data-motif-host': name,
        ...(styleAttr === null ? {} : { 'data-motif-style': styleAttr }),
        ...rest,
      },
      children,
    );
  };
  Host.displayName = name;
  return Host;
}

export const View = makeHost('View', 'div');
export const Text = makeHost('Text', 'span');

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
