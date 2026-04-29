/**
 * Side-effect entry point — calling `import '@motif-js/reset/auto'`
 * injects the reset stylesheet at module load time. The package's
 * `sideEffects` field marks `dist/auto.js` as side-effectful so
 * bundlers don't tree-shake it away.
 *
 * Browser-only. In SSR / worker environments, the inject helper
 * no-ops because `document` is undefined.
 *
 * Re-imports in the same document dedupe via the
 * `<style id="motif-reset">` check inside `injectResetStylesheet()`.
 */
import { injectResetStylesheet } from './inject.js';

injectResetStylesheet();
