import { describe, it } from 'vitest';
import { assertConformance, standardCases } from '@motif-js/test-utils';
import { createNativeAdapter } from './native-adapter.js';

describe('react-native — conformance suite', () => {
  const adapter = createNativeAdapter();
  for (const c of standardCases) {
    it(c.name, () => assertConformance(adapter, c));
  }
});
