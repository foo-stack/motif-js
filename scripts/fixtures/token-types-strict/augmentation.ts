import type { fixtureTheme } from './theme.js';

/**
 * The opt-in a consumer writes to turn on rejection. Both interfaces are
 * augmented here because strict mode without a theme has nothing to check
 * against; `check-token-types.mjs` removes only the `strictTokens` line to
 * prove the flag is what does the work.
 */
declare module 'usemotif' {
  interface MotifCustomTheme extends FixtureTheme {}
  interface MotifTypeOptions {
    strictTokens: true;
  }
}
type FixtureTheme = typeof fixtureTheme;
