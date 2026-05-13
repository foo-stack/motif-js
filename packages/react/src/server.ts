/**
 * Server-only entry. Importing this module **once at app startup**
 * registers an `AsyncLocalStorage`-backed collector storage backend, so
 * concurrent server renders (streaming SSR / RSC / multiple in-flight
 * `renderToString` calls) don't interfere with each other.
 *
 * @example
 *
 * ```ts
 * // app/layout.tsx (Next.js App Router)
 * import '@motif-js/react-web/server';
 * // …rest of your layout
 * ```
 *
 * Re-exports `SSRStyleCollector` and the storage primitives so callers
 * who already had `import * from '@motif-js/react-web'` can switch to
 * the server entry without breaking imports.
 *
 * **Side effect:** importing this file calls
 * `setCollectorStorage(asyncCollectorStorage)`. Idempotent.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import {
  SSRStyleCollector,
  setCollectorStorage,
  syncCollectorStorage,
  type CollectorStorage,
} from './style-cache.js';

/**
 * `AsyncLocalStorage`-backed collector storage. Each call to
 * `collector.collect(fn)` runs `fn` inside an ALS context bound to that
 * collector, so async work spawned from `fn` continues to see the right
 * collector even when other requests are interleaving.
 */
export const asyncCollectorStorage: CollectorStorage = (() => {
  const als = new AsyncLocalStorage<SSRStyleCollector>();
  return {
    get: () => als.getStore() ?? null,
    run<T>(c: SSRStyleCollector, fn: () => T): T {
      return als.run(c, fn);
    },
  };
})();

setCollectorStorage(asyncCollectorStorage);

export { SSRStyleCollector, setCollectorStorage, syncCollectorStorage, type CollectorStorage };
