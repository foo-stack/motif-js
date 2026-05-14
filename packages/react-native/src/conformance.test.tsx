import { describe, it } from 'vitest';
import { assertConformance, standardCases } from '@usemotif/test-utils';
import { createNativeAdapter } from './native-adapter.js';

describe('react-native — conformance suite', () => {
  const adapter = createNativeAdapter();
  for (const c of standardCases) {
    if (c.skipOnRenderer?.includes(adapter.name) === true) {
      it.skip(c.name, () => assertConformance(adapter, c));
      continue;
    }
    it(c.name, () => assertConformance(adapter, c));
  }
});
