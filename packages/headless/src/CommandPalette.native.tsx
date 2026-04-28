import type { ReactElement, ReactNode } from 'react';
import { nativeStubWarn } from './_native-stub.js';

/**
 * Native CommandPalette — a real port should compose the native
 * Dialog with a `FlatList`-backed command list. Until that lands,
 * the native variant null-renders and warns once.
 *
 * The default fuzzy matcher and the `Command` type are pure JS and
 * are re-exported here so cross-platform code can share the same
 * data shape.
 */

export interface Command {
  readonly id: string;
  readonly label: string;
  readonly section?: string;
  readonly keywords?: ReadonlyArray<string>;
  readonly shortcut?: ReadonlyArray<string>;
  readonly icon?: ReactNode;
  readonly disabled?: boolean;
  readonly onSelect: () => void;
}

export interface CommandPaletteRootProps {
  commands: ReadonlyArray<Command>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  recents?: ReadonlyArray<string>;
  onRecentsChange?: (next: ReadonlyArray<string>) => void;
  maxRecents?: number;
  matcher?: (input: string, command: Command) => number | null;
  children?: ReactNode;
}

export interface CommandPaletteListProps {
  renderItem: (
    command: Command,
    info: { highlighted: boolean; isRecent: boolean; index: number },
  ) => ReactNode;
  renderSection?: (section: string) => ReactNode;
  emptyMessage?: ReactNode;
}

function nullStub(name: string): (props: { children?: ReactNode }) => ReactElement | null {
  return ({ children: _children }) => {
    nativeStubWarn(`CommandPalette.${name}`);
    return null;
  };
}

export const CommandPalette = {
  Root: nullStub('Root'),
  Input: nullStub('Input'),
  List: nullStub('List'),
};

/** Pure-JS default matcher — ports identically across platforms. */
export function defaultFuzzyMatch(input: string, command: Command): number | null {
  if (input.length === 0) return 1;
  const i = input.toLowerCase();
  const candidates = [command.label, ...(command.keywords ?? [])];
  let best: number | null = null;
  for (const c of candidates) {
    const score = fuzzyScore(i, c.toLowerCase());
    if (score === null) continue;
    if (best === null || score > best) best = score;
  }
  return best;
}

function fuzzyScore(needle: string, hay: string): number | null {
  const idx = hay.indexOf(needle);
  if (idx !== -1) return 1000 - idx;
  let hi = 0;
  let matched = 0;
  for (const ch of needle) {
    let found = false;
    while (hi < hay.length) {
      if (hay[hi] === ch) {
        matched++;
        hi++;
        found = true;
        break;
      }
      hi++;
    }
    if (!found) return null;
  }
  return matched;
}

export function useCommandPaletteShortcut(_combo: string, _handler: () => void): void {
  nativeStubWarn('useCommandPaletteShortcut');
}
