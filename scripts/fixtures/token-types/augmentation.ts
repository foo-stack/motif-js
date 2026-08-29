import type { fixtureTheme } from './theme.js';

/**
 * The setup a consumer writes, verbatim. `check-token-types.mjs` deletes this
 * file to prove it fails without it, so keep the augmentation here and only
 * here.
 */
declare module 'usemotif' {
  interface MotifCustomTheme extends FixtureTheme {}
}
type FixtureTheme = typeof fixtureTheme;
