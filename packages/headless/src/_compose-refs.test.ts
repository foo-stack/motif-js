/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { mergeRefs } from './_compose-refs.js';

describe('mergeRefs (#262)', () => {
  it('assigns to object refs and calls function refs with the same node', () => {
    const objectRef = createRef<HTMLDivElement>();
    const fnRef = vi.fn();
    const node = document.createElement('div');

    mergeRefs(objectRef, fnRef)(node);

    expect(objectRef.current).toBe(node);
    expect(fnRef).toHaveBeenCalledWith(node);
  });

  it('skips null / undefined entries without throwing', () => {
    const objectRef = createRef<HTMLDivElement>();
    const node = document.createElement('div');
    expect(() => mergeRefs(undefined, null, objectRef)(node)).not.toThrow();
    expect(objectRef.current).toBe(node);
  });

  it('forwards null on unmount to every ref', () => {
    const objectRef = createRef<HTMLDivElement>();
    const fnRef = vi.fn();
    const merged = mergeRefs(objectRef, fnRef);
    merged(document.createElement('div'));
    merged(null);
    expect(objectRef.current).toBeNull();
    expect(fnRef).toHaveBeenLastCalledWith(null);
  });
});
