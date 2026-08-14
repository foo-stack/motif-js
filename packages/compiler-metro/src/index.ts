import motifBabelPlugin, { type MotifBabelOptions } from '@usemotif/compiler-babel';

/**
 * The shape of a Babel plugin entry the way Metro / babel-preset-expo
 * expect: a tuple of `[plugin, options]`. Metro consumes this from the
 * project's `babel.config.js` so the motif transform layers into the
 * existing JS pipeline (no separate Metro transformer needed; Metro
 * already runs Babel for every file).
 *
 * Usage in a React Native / Expo project's `babel.config.js`:
 *
 * ```js
 * const motif = require('@usemotif/compiler-metro').default;
 * module.exports = function (api) {
 *   api.cache(true);
 *   return {
 *     presets: ['babel-preset-expo'],
 *     plugins: [motif({ target: 'native' })],
 *   };
 * };
 * ```
 *
 * Conceptually this is just a renamed re-export of
 * `@usemotif/compiler-babel` with the `target` defaulted to `'native'`,
 * since that's what RN consumers always want. Keeping it as its own
 * package gives us a place to add Metro-specific configuration plumbing
 * later (CSS extraction is a no-op on native, but a per-file
 * `StyleSheet.create({...})` hoister will land here).
 */
// `cssLayer` is omitted alongside `target`: cascade layers are a CSS-only
// mechanism and this plugin always compiles for native, which has no cascade
// for a layer to order against.
export interface MotifMetroOptions extends Omit<MotifBabelOptions, 'target' | 'cssLayer'> {
  /** Target. Defaults to `'native'`. Override only when sharing config. */
  readonly target?: 'web' | 'native';
}

const motifMetro = (options: MotifMetroOptions = {}): readonly [unknown, MotifBabelOptions] => {
  const { target = 'native', ...rest } = options;
  return [motifBabelPlugin, { ...rest, target } satisfies MotifBabelOptions];
};

export default motifMetro;
export const PACKAGE_NAME = '@usemotif/compiler-metro';
