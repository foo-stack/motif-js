/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { inDomOrder } from './_dom-order.js';

describe('inDomOrder (#240)', () => {
  it('sorts elements by document position regardless of input order', () => {
    const parent = document.createElement('div');
    const a = document.createElement('span');
    const b = document.createElement('span');
    const c = document.createElement('span');
    parent.append(a, b, c);

    // Mount-order registry that no longer matches DOM order: B mounted last
    // (appended to the registry) but sits between A and C in the DOM.
    const registry = [a, c, b];
    expect(inDomOrder(registry)).toEqual([a, b, c]);
  });

  it('does not mutate the input array', () => {
    const parent = document.createElement('div');
    const a = document.createElement('i');
    const b = document.createElement('i');
    parent.append(a, b);
    const input = [b, a];
    inDomOrder(input);
    expect(input).toEqual([b, a]);
  });
});
