import { RESET_CSS, RESET_STYLE_ID } from './reset-css.js';

/**
 * Imperatively inject the reset stylesheet into `document.head`.
 * Idempotent - checks for an existing `<style id="motif-reset">` and
 * bails if found, so calling twice is safe.
 *
 * No-ops in non-browser environments (SSR, workers) where `document`
 * is undefined.
 *
 * For SSR, prefer the `<MotifReset />` component, which renders a
 * `<style>` element React can serialise.
 */
export function injectResetStylesheet(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(RESET_STYLE_ID) !== null) return;
  const style = document.createElement('style');
  style.id = RESET_STYLE_ID;
  style.textContent = RESET_CSS;
  // Insert at the top of <head> so author CSS (loaded after) wins
  // any specificity ties - the reset is a baseline, not an override.
  document.head.prepend(style);
}
