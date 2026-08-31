'use client';

import type { Direction } from '@usemotif/core';
import { createContext, useContext } from 'react';

/**
 * Writing-direction context. Defaults to `'ltr'`. The `<Direction>`
 * provider sets it for a subtree; on the web the actual layout flip is
 * done by the browser from the `dir` attribute `<Direction>` renders -
 * this context exists so components and app code can *read* the
 * current direction via {@link useDirection}.
 */
export const DirectionContext = createContext<Direction>('ltr');

/**
 * Returns the writing direction of the nearest `<Direction>` provider,
 * or `'ltr'` if there is none.
 */
export function useDirection(): Direction {
  return useContext(DirectionContext);
}
