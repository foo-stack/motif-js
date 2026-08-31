/**
 * `@usemotif/reset` - opt-in CSS reset for motif-js on the web.
 *
 * Three ways to apply the reset, in increasing order of automatism:
 *
 * 1. **`<MotifReset />`** - render once near the top of your app's
 *    React tree. SSR-friendly (renders a real `<style>` element).
 * 2. **`injectResetStylesheet()`** - call once at app startup
 *    (browser only). Idempotent.
 * 3. **`import '@usemotif/reset/auto'`** - side-effect import that
 *    calls `injectResetStylesheet()` at module load.
 *
 * The reset is a single static string (`RESET_CSS`) you can also
 * splice into your own stylesheet pipeline if none of the above fit.
 *
 * Native is intentionally not covered: React Native has no global
 * stylesheet to reset; the platform's defaults are the baseline.
 */

export const PACKAGE_NAME = '@usemotif/reset';

export { RESET_CSS, RESET_STYLE_ID } from './reset-css.js';
export { injectResetStylesheet } from './inject.js';
export { MotifReset } from './component.js';
