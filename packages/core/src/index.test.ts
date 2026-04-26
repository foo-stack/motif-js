import { describe, expect, it } from 'vitest';
import { PACKAGE_NAME } from './index.js';

describe('@motif-js/core', () => {
  it('exports its package name', () => {
    expect(PACKAGE_NAME).toBe('@motif-js/core');
  });
});
