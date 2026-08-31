import { describe, expect, it } from 'vitest';
import * as barrel from './index.js';
import * as client from './client.js';

/**
 * The barrel re-exports from `./client.js` by name instead of with `export *`,
 * because `export *` would also republish the flattened compound parts and make
 * every one of them public API in a fixed-version package. The cost of listing
 * names is that a new export can be added to the client chunk and never reach
 * anyone. These tests are what turns that into a failure instead of a silence.
 */

/** Flattened parts exist so the barrel can assemble namespaces. Not public. */
const INTERNAL_PARTS = [
  'DialogRoot',
  'DialogTrigger',
  'DialogContent',
  'DialogTitle',
  'DialogDescription',
  'DialogClose',
];

describe('the barrel and the client chunk agree', () => {
  it('re-exports every client export that is not an internal part', () => {
    const missing = Object.keys(client)
      .filter((name) => !INTERNAL_PARTS.includes(name))
      .filter((name) => !(name in barrel));
    expect(missing).toEqual([]);
  });

  it('keeps the internal parts out of the public surface', () => {
    expect(INTERNAL_PARTS.filter((name) => name in barrel)).toEqual([]);
  });

  it('assembles Dialog from those parts rather than re-exporting an object', () => {
    // Identity per part, not just the key set: a namespace built from the wrong
    // parts would still have the right shape and would still fail to render.
    expect({ ...barrel.Dialog }).toEqual({
      Root: client.DialogRoot,
      Trigger: client.DialogTrigger,
      Content: client.DialogContent,
      Title: client.DialogTitle,
      Description: client.DialogDescription,
      Close: client.DialogClose,
    });
    expect(Object.values(barrel.Dialog).every((part) => typeof part === 'function')).toBe(true);
  });
});
