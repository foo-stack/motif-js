import { describe, expect, it } from 'vitest';
import * as barrel from './index.js';
import * as client from './client.js';

/**
 * The barrel re-exports from `./client.js` by name instead of with `export *`,
 * because `export *` would also republish the flattened compound parts and make
 * every one of them public API in a fixed-version package. The cost of listing
 * names is that a name can be added to the client chunk and never reach anyone,
 * or a part can be left wired to nothing. These tests turn both into failures.
 *
 * Nothing here is a hardcoded list of parts. The invariant is derived from the
 * namespaces the barrel actually builds, so converting another component keeps
 * it honest without anyone remembering to update a fixture.
 */

type Part = (...args: never[]) => unknown;

/** A namespace is a plain object whose every value is a component. */
function isNamespace(value: unknown): value is Record<string, Part> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).length > 0 &&
    Object.values(value).every((member) => typeof member === 'function')
  );
}

const namespaces = Object.entries(barrel).filter(([, value]) => isNamespace(value)) as [
  string,
  Record<string, Part>,
][];

/** Every function a namespace is built from, by identity rather than by name. */
const partValues = new Set(namespaces.flatMap(([, ns]) => Object.values(ns)));

describe('the barrel and the client chunk agree', () => {
  it('builds every compound component as a namespace', () => {
    expect(namespaces.map(([name]) => name).sort()).toEqual([
      'Accordion',
      'AlertDialog',
      'Collapsible',
      'Combobox',
      'CommandPalette',
      'ContextMenu',
      'Dialog',
      'Drawer',
      'HoverCard',
      'Menu',
      'MultiSelect',
      'Popover',
      'Search',
      'Select',
      'Sheet',
      'Tabs',
      'Tooltip',
    ]);
  });

  it('leaves no client export unreachable', () => {
    // Either the barrel re-exports it by name, or a namespace is built from it.
    // Anything else ships in the chunk and reaches nobody.
    const orphaned = Object.entries(client)
      .filter(([name, value]) => !(name in barrel) && !partValues.has(value as Part))
      .map(([name]) => name);
    expect(orphaned).toEqual([]);
  });

  it('keeps the flattened parts out of the public surface', () => {
    const leaked = Object.entries(client)
      .filter(([name, value]) => partValues.has(value as Part) && name in barrel)
      .map(([name]) => name);
    expect(leaked).toEqual([]);
  });

  it('builds each namespace out of the client chunk, not out of copies', () => {
    const clientValues = new Set<unknown>(Object.values(client));
    const foreign = namespaces.flatMap(([name, ns]) =>
      Object.entries(ns)
        .filter(([, member]) => !clientValues.has(member))
        .map(([key]) => `${name}.${key}`),
    );
    expect(foreign).toEqual([]);
  });

  it('shares one client reference where namespaces share a part', () => {
    // Reuse is resolved in the barrel, so a shared part must be the identical
    // reference. A copy would render, and would break identity checks and any
    // future per-component chunking.
    expect(barrel.AlertDialog.Trigger).toBe(barrel.Dialog.Trigger);
    expect(barrel.Drawer.Title).toBe(barrel.Dialog.Title);
    expect(barrel.Sheet.Root).toBe(barrel.Drawer.Root);
    expect(barrel.Accordion.Content).toBe(barrel.Collapsible.Content);
    expect(barrel.ContextMenu.Separator).toBe(barrel.Menu.Separator);
    expect(barrel.Select.List).toBe(barrel.Combobox.List);
    expect(barrel.Search.Input).toBe(barrel.Combobox.Input);
  });
});
