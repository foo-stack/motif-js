import { transformAsync } from '@babel/core';
import motifBabelPlugin, { type MotifBabelOptions } from '@motif-js/compiler-babel';
import { createUnplugin, type UnpluginInstance } from 'unplugin';

/**
 * Options for the bundler-side motif transform.
 *
 * Despite the package name "swc", this is a universal `unplugin` shim
 * that exposes `vite`, `rollup`, `webpack`, `rspack`, `esbuild`, `farm`
 * entry points from one source. Internally it runs the canonical
 * `@motif-js/compiler-babel` transform on every relevant file. SWC-based
 * toolchains (Next, Vite via `@vitejs/plugin-react-swc`) layer this
 * BEFORE their SWC pass — motif extracts, then SWC compiles JSX.
 */
export interface MotifBundlerOptions extends MotifBabelOptions {
  /**
   * File-extension allow-list. Defaults to ts/tsx/jsx/js. The plugin only
   * runs Babel against files it accepts, so it's cheap to enable on
   * mixed codebases.
   */
  readonly include?: ReadonlyArray<string | RegExp>;
  /**
   * Glob/regex paths to skip. By default `node_modules/` is excluded; if
   * you maintain a vendored package whose JSX should also be extracted,
   * pass the relevant override here.
   */
  readonly exclude?: ReadonlyArray<string | RegExp>;
}

const DEFAULT_INCLUDE: readonly RegExp[] = [/\.[mc]?[jt]sx?$/];
const DEFAULT_EXCLUDE: readonly RegExp[] = [/node_modules/];

function shouldTransform(
  id: string,
  include: ReadonlyArray<string | RegExp>,
  exclude: ReadonlyArray<string | RegExp>,
): boolean {
  for (const pat of exclude) {
    if (typeof pat === 'string' ? id.includes(pat) : pat.test(id)) return false;
  }
  for (const pat of include) {
    if (typeof pat === 'string' ? id.includes(pat) : pat.test(id)) return true;
  }
  return false;
}

/**
 * Universal motif extractor as an `unplugin` instance.
 *
 * Usage:
 * ```ts
 * // vite.config.ts
 * import motif from '@motif-js/compiler-swc';
 * export default { plugins: [motif.vite()] };
 * ```
 *
 * The plugin emits a virtual `motif-extract.css` that aggregates every
 * extracted at-rule across the build. Hosts that need the CSS sooner
 * (e.g. dev-server HMR) can listen via the `onCss` option to catch CSS
 * per-file as it lands.
 */
export const motifExtract: UnpluginInstance<MotifBundlerOptions | undefined, false> =
  createUnplugin((rawOptions) => {
    const options = rawOptions ?? {};
    const include = options.include ?? DEFAULT_INCLUDE;
    const exclude = options.exclude ?? DEFAULT_EXCLUDE;
    const aggregatedCss: string[] = [];

    return {
      name: '@motif-js/compiler-swc',
      enforce: 'pre',
      transformInclude(id) {
        return shouldTransform(id, include, exclude);
      },
      async transform(code, id) {
        const babelResult = await transformAsync(code, {
          babelrc: false,
          configFile: false,
          filename: id,
          sourceMaps: true,
          parserOpts: { plugins: ['jsx', 'typescript'] },
          plugins: [
            [
              motifBabelPlugin,
              {
                ...options,
                onCss: (css, file) => {
                  aggregatedCss.push(css);
                  options.onCss?.(css, file);
                },
              } satisfies MotifBabelOptions,
            ],
          ],
        });
        if (babelResult === null || babelResult.code === null || babelResult.code === undefined) {
          return null;
        }
        return {
          code: babelResult.code,
          map: babelResult.map ?? null,
        };
      },
    };
  });

export default motifExtract;
export const PACKAGE_NAME = '@motif-js/compiler-swc';
