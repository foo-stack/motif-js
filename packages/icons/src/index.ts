/**
 * @motif-js/icons — pre-built icons over `<Icon>` from `@motif-js/react`.
 *
 * Phase E ships a starter set of 12 commonly-used glyphs (Plus,
 * Check, X, ChevronUp/Down/Left/Right, Search, Trash, Heart, Star,
 * ArrowRight). The full ~200-icon Phosphor-inspired set lands in a
 * later patch — these cover the playground demos + the most common
 * UI affordances.
 *
 * Each icon is a small React component that returns an `<Icon>`
 * with the appropriate `<path>` / `<line>` / `<circle>` children.
 * Sizes / colour are inherited from the parent's font-size + colour
 * (the SVGs use `currentColor`).
 */

export const PACKAGE_NAME = '@motif-js/icons';

export { ArrowRight } from './glyphs/ArrowRight.js';
export { Check } from './glyphs/Check.js';
export { ChevronDown } from './glyphs/ChevronDown.js';
export { ChevronLeft } from './glyphs/ChevronLeft.js';
export { ChevronRight } from './glyphs/ChevronRight.js';
export { ChevronUp } from './glyphs/ChevronUp.js';
export { Heart } from './glyphs/Heart.js';
export { Plus } from './glyphs/Plus.js';
export { Search } from './glyphs/Search.js';
export { Star } from './glyphs/Star.js';
export { Trash } from './glyphs/Trash.js';
export { X } from './glyphs/X.js';

export type { IconProps } from '@motif-js/react';
