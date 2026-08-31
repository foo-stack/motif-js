import type { Direction } from '@usemotif/core';
import { createContext, useContext } from 'react';
import { I18nManager } from 'react-native';

/**
 * Writing-direction context. `undefined` means no `<Direction>`
 * provider is in scope - {@link useDirection} then falls back to RN's
 * global `I18nManager` setting.
 */
export const DirectionContext = createContext<Direction | undefined>(undefined);

/**
 * Returns the writing direction of the nearest `<Direction>` provider.
 *
 * With no provider in scope it falls back to RN's global
 * `I18nManager.isRTL`, so an app that flips RTL the conventional
 * native way still gets the right value here and from motif's
 * primitives. `Box` and `Text` read this and inject the Yoga
 * `direction` style so logical props and `row` layouts flip.
 */
export function useDirection(): Direction {
  const ctx = useContext(DirectionContext);
  if (ctx !== undefined) return ctx;
  return I18nManager.isRTL ? 'rtl' : 'ltr';
}
