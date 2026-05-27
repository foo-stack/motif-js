import { createContext, useContext } from 'react';

/**
 * Internal stagger context (native). Mirrors the web shape: `<Stack
 * stagger>` provides a per-child delay (seconds); `<Box>`'s entry
 * dispatch reads it and forwards `delayMs` to the active driver's
 * `useEntryAnimation`.
 *
 * Default value `0` means "no stagger" so consumers can read without
 * conditional guards.
 */
export const StaggerContext = createContext<number>(0);

/**
 * Read the current stagger delay (seconds). `<Stack stagger={s}>` sets
 * this to `index * s` for each direct child; outside any stagger
 * provider it returns `0`.
 */
export function useStaggerDelay(): number {
  return useContext(StaggerContext);
}
