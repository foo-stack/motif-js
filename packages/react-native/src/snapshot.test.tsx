import { describe, expect, it } from 'vitest';
import { standardCases } from '@usemotif/test-utils';
import { createNativeAdapter } from './native-adapter.js';

/**
 * Snapshot the normalised `RendererOutput` for every standard case
 * against the native renderer. Catches drift in the resolver / native
 * adapter equivalent to the web renderer's snapshot suite.
 */
describe('react-native — snapshot suite (across standard cases)', () => {
  const adapter = createNativeAdapter();
  for (const c of standardCases) {
    it(c.name, () => {
      const out = adapter.render(c);
      expect(out).toMatchSnapshot();
    });
  }
});
