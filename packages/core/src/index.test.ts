import { describe, expect, it } from 'vitest';
import { PACKAGE_NAME } from './index.js';

describe('@usemotif/core', () => {
  it('exports its package name', () => {
    expect(PACKAGE_NAME).toBe('@usemotif/core');
  });
});
