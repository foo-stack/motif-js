'use client';

import type { Direction as DirectionValue } from '@usemotif/core';
import type { ReactNode } from 'react';
import { DirectionContext } from './direction-context.js';

export interface DirectionProps {
  /** Writing direction applied to the subtree. */
  value: DirectionValue;
  children?: ReactNode;
}

/**
 * Sets the writing direction for a subtree.
 *
 * Renders a `dir`-carrying boundary so the browser flips CSS logical
 * properties (`padding-inline`, `inset-inline-start`, ...) and `row`
 * flex layouts automatically. The boundary uses `display: contents`,
 * so it adds no box of its own and does not disturb the surrounding
 * layout. Nest `<Direction>` providers to override the direction for
 * an inner subtree.
 *
 * @example
 *
 * ```tsx
 * <Direction value="rtl">
 *   <App />
 * </Direction>
 * ```
 */
export function Direction({ value, children }: DirectionProps) {
  return (
    <DirectionContext.Provider value={value}>
      <div dir={value} style={{ display: 'contents' }}>
        {children}
      </div>
    </DirectionContext.Provider>
  );
}
