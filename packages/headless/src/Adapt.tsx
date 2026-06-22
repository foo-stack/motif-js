'use client';

import type { BreakpointName } from '@usemotif/core';
import type { ReactElement } from 'react';
import { Dialog, type DialogContentProps } from './Dialog.js';
import { Drawer } from './Drawer.js';
import { useViewportMatch } from './_use-viewport-match.js';

export interface AdaptProps extends DialogContentProps {
  /**
   * Adapt to a drawer when the viewport is strictly below this breakpoint.
   * Defaults to `'md'` when neither `below` nor `above` is set, so the common
   * "dialog on desktop, sheet on mobile" case needs no configuration.
   */
  readonly below?: BreakpointName;
  /** Adapt to a drawer when the viewport is at or above this breakpoint. */
  readonly above?: BreakpointName;
  /**
   * Which edge the drawer anchors to when adapted. Defaults to `'bottom'`
   * (a sheet) — the touch-idiomatic form.
   */
  readonly side?: 'left' | 'right' | 'top' | 'bottom';
}

/**
 * Renders `Dialog.Content` normally, and shapeshifts into a `Drawer.Content`
 * (a sheet) when the viewport enters the adapt band. Use it inside a
 * `Dialog.Root` in place of `Dialog.Content` — the open-state context is
 * shared, so the trigger, title, description, and close all work unchanged on
 * both presentations:
 *
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger><button>Open</button></Dialog.Trigger>
 *   <Adapt below="md" side="bottom">
 *     <Dialog.Title>Settings</Dialog.Title>
 *     …
 *   </Adapt>
 * </Dialog.Root>
 * ```
 *
 * All `Dialog.Content` props (`exitDurationMs`, `dismissOnEscape`,
 * `dismissOnScrimClick`, `style`, …) forward to whichever presentation is
 * active.
 */
export function Adapt({
  below,
  above,
  side = 'bottom',
  ...content
}: AdaptProps): ReactElement | null {
  // When the consumer pins neither bound, default to "below md" (mobile).
  const effectiveBelow = below ?? (above === undefined ? 'md' : undefined);
  const adapted = useViewportMatch(above, effectiveBelow);
  return adapted ? <Drawer.Content side={side} {...content} /> : <Dialog.Content {...content} />;
}
