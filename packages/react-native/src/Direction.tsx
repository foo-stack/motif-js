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
 * Provides the direction via context; `Box` and `Text` consume it and
 * inject the Yoga `direction` style, so logical props
 * (`paddingInline`, `insetInlineStart`, …) and `row` flex layouts flip
 * for every motif primitive below. Nest providers to override the
 * direction for an inner subtree.
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
  return <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>;
}
