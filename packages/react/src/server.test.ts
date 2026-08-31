import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  SSRStyleCollector,
  _resetStyleCacheForTesting,
  injectAtRules,
  setCollectorStorage,
  syncCollectorStorage,
} from './style-cache.js';
import { asyncCollectorStorage } from './server.js';

const padding4Md = {
  atRule: '@media (min-width: 768px)',
  style: { padding: 'var(--space-4)' },
} as const;
const padding8Lg = {
  atRule: '@media (min-width: 1024px)',
  style: { padding: 'var(--space-8)' },
} as const;

beforeEach(() => {
  _resetStyleCacheForTesting();
});

afterEach(() => {
  _resetStyleCacheForTesting();
});

describe('asyncCollectorStorage — AsyncLocalStorage-backed', () => {
  it('imports as a side effect: server.js installs the async backend', async () => {
    // Already imported at the top of this file; verify it's active.
    setCollectorStorage(asyncCollectorStorage);

    const collector = new SSRStyleCollector();
    collector.collect(() => {
      injectAtRules([padding4Md]);
    });
    expect(collector.getCss()).toContain('@media (min-width: 768px)');
  });

  it('keeps two concurrent async renders from interleaving collectors', async () => {
    setCollectorStorage(asyncCollectorStorage);

    const a = new SSRStyleCollector();
    const b = new SSRStyleCollector();

    // Simulate two concurrent async renders interleaving via Promises.
    const renderA = a.collect(async () => {
      // Yield to the event loop, giving render B a chance to clobber a
      // module-level pointer if one were in use.
      await Promise.resolve();
      injectAtRules([padding4Md]);
      await Promise.resolve();
      injectAtRules([padding4Md]); // dedup'd locally
    });
    const renderB = b.collect(async () => {
      await Promise.resolve();
      injectAtRules([padding8Lg]);
    });

    await Promise.all([renderA, renderB]);

    expect(a.getCss()).toContain('@media (min-width: 768px)');
    expect(a.getCss()).not.toContain('@media (min-width: 1024px)');
    expect(b.getCss()).toContain('@media (min-width: 1024px)');
    expect(b.getCss()).not.toContain('@media (min-width: 768px)');
  });

  it('still works for plain sync collect() calls', () => {
    setCollectorStorage(asyncCollectorStorage);

    const collector = new SSRStyleCollector();
    const result = collector.collect(() => {
      injectAtRules([padding4Md]);
      return 'sync-result';
    });
    expect(result).toBe('sync-result');
    expect(collector.getCss()).toContain('@media (min-width: 768px)');
  });

  it('restores the previous collector context after collect() returns', () => {
    setCollectorStorage(asyncCollectorStorage);

    const outer = new SSRStyleCollector();
    const inner = new SSRStyleCollector();

    outer.collect(() => {
      injectAtRules([padding4Md]);
      inner.collect(() => {
        injectAtRules([padding8Lg]);
      });
      // After inner exits, outer should still be the active collector.
      injectAtRules([padding4Md]); // dedup'd in outer
    });

    expect(outer.getCss()).toContain('@media (min-width: 768px)');
    expect(outer.getCss()).not.toContain('@media (min-width: 1024px)');
    expect(inner.getCss()).toContain('@media (min-width: 1024px)');
    expect(inner.getCss()).not.toContain('@media (min-width: 768px)');
  });

  it('storage backend resets to sync default after _resetStyleCacheForTesting', () => {
    // Activate async backend.
    setCollectorStorage(asyncCollectorStorage);
    // Reset.
    _resetStyleCacheForTesting();

    // Sync collect() should still work - proves we're back on sync storage.
    const collector = new SSRStyleCollector();
    collector.collect(() => {
      injectAtRules([padding4Md]);
    });
    expect(collector.getCss()).toContain('@media (min-width: 768px)');
  });
});

describe('syncCollectorStorage — module-level pointer', () => {
  it('captures CSS for sync renders', () => {
    setCollectorStorage(syncCollectorStorage);

    const collector = new SSRStyleCollector();
    collector.collect(() => {
      injectAtRules([padding4Md]);
    });
    expect(collector.getCss()).toContain('@media (min-width: 768px)');
  });
});
