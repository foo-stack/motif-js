import { describe, expect, it } from 'vitest';
import { standardCases } from '@usemotif/test-utils';
import { createWebAdapter } from './web-adapter.js';

/**
 * Snapshot the normalised `RendererOutput` for every standard case.
 * Catches accidental drift in either the resolver or the web renderer
 * (e.g. a rule emitted with the wrong selector, a px unit appearing
 * where a number was expected, a token ref leaking through unresolved).
 *
 * If a snapshot diff is intentional, run `vitest --update` and commit
 * the new snapshot file alongside the change.
 */
describe('react-web — snapshot suite (across standard cases)', () => {
  const adapter = createWebAdapter();
  for (const c of standardCases) {
    it(c.name, () => {
      const out = adapter.render(c);
      expect(out).toMatchSnapshot();
    });
  }
});
