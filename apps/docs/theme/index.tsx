// eslint-disable-next-line import/no-unassigned-import -- CSS side-effect import is the standard Vite pattern.
import './theme.css';

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
