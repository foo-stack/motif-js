'use client';

import type { BreakpointName } from '@usemotif/core';
import type { ReactElement } from 'react';
import { Dialog, type DialogContentProps } from './Dialog.js';
import { Drawer } from './Drawer.js';
import { useViewportMatch } from './_use-viewport-match.js';

export interface AdaptProps extends DialogContentProps {
  /**
   * Adapt to a drawer when the viewport is strictly below this breakpoint — a
   * breakpoint name (resolved against the app's configured widths) or an
   * explicit pixel width. Defaults to `'md'` when neither `below` nor `above`
   * is set.
   */
  readonly below?: BreakpointName | number;
  /**
   * Adapt to a drawer when the viewport is at or above this breakpoint — a
   * breakpoint name or an explicit pixel width.
   */
  readonly above?: BreakpointName | number;
  /** Which edge the drawer anchors to when adapted. Defaults to `'bottom'`. */
  readonly side?: 'left' | 'right' | 'top' | 'bottom';
}

/**
 * Native `Adapt`. Same contract as the web version — renders `Dialog.Content`
 * above the adapt band and `Drawer.Content` within it — reading the window
 * width from `Dimensions`. `side` is accepted for API parity but is advisory on
 * native (the native drawer's edge is driven by the consumer's `style`, like
 * `Drawer.Content`'s own `position`), so it isn't forwarded.
 */
export function Adapt({
  below,
  above,
  side: _side = 'bottom',
  ...content
}: AdaptProps): ReactElement | null {
  const effectiveBelow = below ?? (above === undefined ? 'md' : undefined);
  const adapted = useViewportMatch(above, effectiveBelow);
  return adapted ? <Drawer.Content {...content} /> : <Dialog.Content {...content} />;
}
