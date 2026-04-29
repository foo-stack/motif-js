import { createElement, type ReactElement } from 'react';
import { RESET_CSS, RESET_STYLE_ID } from './reset-css.js';

/**
 * SSR-friendly React component that renders a `<style>` element
 * containing the motif reset. Render once near the top of the
 * application tree (typically inside `<head>` for Next.js / Remix
 * apps, or as the first child of the root component otherwise).
 *
 * The element carries `id="motif-reset"` so React's hydration won't
 * duplicate it if the auto-inject path also ran.
 */
export function MotifReset(): ReactElement {
  return createElement('style', {
    id: RESET_STYLE_ID,
    dangerouslySetInnerHTML: { __html: RESET_CSS },
  });
}
