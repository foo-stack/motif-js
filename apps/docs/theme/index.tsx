// eslint-disable-next-line import/no-unassigned-import -- transitional bridge: responsive show/hide + grid-template-columns utilities + transform passthrough. Motif's responsive props put base values inline (style="display:none"), losing CSS-specificity to class-scoped @media overrides. Deleted once motif fixes that (post-1.4).
import './_responsive.css';
// eslint-disable-next-line import/no-unassigned-import -- last surviving CSS file: globals (* { box-sizing }, body bg, a transition) and third-party `vorge-pagefind-*` overrides. The pagefind overrides target HTML emitted by a peer dep we don't author.
import './chrome.css';

import type { ThemeLayouts } from '@vorge/core/runtime';
import {
  ApiLayout,
  BlankLayout,
  BlogPostLayout,
  ChangelogLayout,
  DocLayout,
  GuideLayout,
  MarketingLayout,
  NotFoundLayout,
} from './layouts.js';

export const layouts: ThemeLayouts = {
  doc: DocLayout,
  blank: BlankLayout,
  marketing: MarketingLayout,
  'blog-post': BlogPostLayout,
  changelog: ChangelogLayout,
  api: ApiLayout,
  guide: GuideLayout,
  '404': NotFoundLayout,
};

export { darkTheme, lightTheme, themes } from './tokens.js';
export {
  ApiLayout,
  BlankLayout,
  BlogPostLayout,
  ChangelogLayout,
  DocLayout,
  GuideLayout,
  MarketingLayout,
  NotFoundLayout,
} from './layouts.js';

export default { layouts };
