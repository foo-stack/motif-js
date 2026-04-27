import { createContext, useContext } from 'react';

/**
 * Carries the chain of `<Container>` ancestors' measured widths down
 * to descendants. Two pieces:
 *
 * - `nearestWidth` — the width of the nearest enclosing `<Container>`.
 *   Used by `@<bp>` (anonymous container) keys.
 * - `named` — a `Map<containerName, width>` populated by every
 *   `<Container name="…">` in the ancestor chain. Used by
 *   `@<name>.<bp>` keys.
 *
 * Default value is "no container" — `nearestWidth: null`, empty map.
 * Descendants of a Box outside any Container resolve container keys
 * to `undefined` (the prop is dropped from style).
 */
export interface ContainerContextValue {
  readonly nearestWidth: number | null;
  readonly named: ReadonlyMap<string, number>;
}

const EMPTY_NAMED: ReadonlyMap<string, number> = new Map();
const DEFAULT_VALUE: ContainerContextValue = { nearestWidth: null, named: EMPTY_NAMED };

export const ContainerContext = createContext<ContainerContextValue>(DEFAULT_VALUE);

export function useContainerInfo(): ContainerContextValue {
  return useContext(ContainerContext);
}
