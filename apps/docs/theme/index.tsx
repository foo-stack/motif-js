// eslint-disable-next-line import/no-unassigned-import -- CSS side-effect import is the standard Vite pattern.
import './theme.css';
// eslint-disable-next-line import/no-unassigned-import -- chrome CSS layer (TopNav, Sidebar, TOC, PageNav, Footer styles).
import './chrome.css';
// eslint-disable-next-line import/no-unassigned-import -- article surface CSS (callout/code/tabs/steps/filetree/image/api).
import './article.css';
// eslint-disable-next-line import/no-unassigned-import -- landing page CSS (hero/marquee/bento/comparison/stats/quotes/showcase/gallery/cta).
import './home.css';

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
