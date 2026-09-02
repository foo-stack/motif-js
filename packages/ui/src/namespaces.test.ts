/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import * as barrel from './index.js';

/**
 * The kit assembles each compound component in its own `*.namespace.ts` module,
 * which carries no `'use client'` directive so the object is built in the server
 * graph and every property is a client reference rather than a read through a
 * proxy.
 *
 * Nothing enforced that before. Seven of the fourteen were left assembled inside
 * `'use client'` modules and shipped that way in a release whose notes said the
 * conversion was complete, because a namespace built the wrong way behaves
 * identically everywhere except inside a React Server Components graph. The unit
 * suite cannot see the difference and neither can `require()` in plain Node.
 *
 * So this checks the arrangement rather than the behaviour: every compound
 * export must come from a namespace module, and every namespace module must stay
 * out of the client graph. Derived from the barrel's own source, so converting
 * another component keeps it honest with no fixture to update.
 */

const barrelSource: string = import.meta.glob('./index.ts', {
  query: '?raw',
  eager: true,
  import: 'default',
})['./index.ts'] as string;

const namespaceSources = import.meta.glob('./*.namespace.ts', {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>;

/** A compound component: a plain object whose every value is a component. */
function isCompound(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).length > 0 &&
    Object.values(value).every((member) => typeof member === 'function')
  );
}

/** `Object.assign(Root, { Item })`: callable, and carrying components. */
function isCallableCompound(value: unknown): boolean {
  if (typeof value !== 'function') return false;
  const extras = Object.keys(value).filter((k) => !['length', 'name', 'prototype'].includes(k));
  return extras.length > 0 && extras.every((k) => typeof (value as never)[k] === 'function');
}

const compound = Object.entries(barrel)
  .filter(([, v]) => isCompound(v) || isCallableCompound(v))
  .map(([name]) => name);

describe('every compound component is assembled in the server graph', () => {
  it('finds the compound exports', () => {
    expect(compound.sort()).toEqual([
      'Accordion',
      'AlertDialog',
      'Breadcrumb',
      'Collapsible',
      'ContextMenu',
      'Drawer',
      'HoverCard',
      'Menu',
      'Modal',
      'NavigationMenu',
      'Popover',
      'Sheet',
      'Tabs',
      'Tooltip',
    ]);
  });

  it('re-exports each one from a namespace module, never from a component module', () => {
    const wrong = compound.filter((name) => {
      const line = barrelSource
        .split('\n')
        .find((l) => new RegExp(`^export \\{[^}]*\\b${name}\\b[^}]*\\} from`).test(l));
      return line === undefined || !line.includes(".namespace.js'");
    });
    expect(wrong).toEqual([]);
  });

  it('keeps every namespace module out of the client graph', () => {
    const directives = Object.entries(namespaceSources)
      .filter(([, source]) => /^\s*['"]use client['"]/.test(source))
      .map(([file]) => file);
    expect(directives).toEqual([]);
  });

  it('assembles from parts, so no namespace module declares a component', () => {
    // A component declared here would be in the server graph and could not take
    // an event handler. Parts belong in the `'use client'` module beside it.
    const declaring = Object.entries(namespaceSources)
      .filter(([, source]) => /\bfunction [A-Z]/.test(source) || /=>\s*(\(|<)/.test(source))
      .map(([file]) => file);
    expect(declaring).toEqual([]);
  });
});
