import { transformAsync } from '@babel/core';
import motifBabelPlugin, { type MotifBabelOptions } from '@usemotif/compiler-babel';
import type { NormalizedOutputOptions, OutputBundle } from 'rollup';
import { createUnplugin, type UnpluginInstance } from 'unplugin';

/**
 * Options for the bundler-side motif transform.
 *
 * Despite the package name "swc", this is a universal `unplugin` shim
 * that exposes `vite`, `rollup`, `webpack`, `rspack`, `esbuild`, `farm`
 * entry points from one source. Internally it runs the canonical
 * `@usemotif/compiler-babel` transform on every relevant file. SWC-based
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

/**
 * Virtual module id surfaced to the user. Importing this anywhere in
 * the entry tree (typical: from your root layout / main entry) tells
 * the bundler to ship the aggregated extracted CSS as a real asset:
 *
 * ```ts
 * import 'virtual:motif-extract.css';
 * ```
 *
 * The bare-name alias `'motif-extract.css'` is also resolved for
 * frameworks that rewrite virtual: prefixes.
 */
const VIRTUAL_ID = 'virtual:motif-extract.css';
const VIRTUAL_ID_ALIAS = 'motif-extract.css';
// Rollup convention: `\0`-prefixed ids are not resolved against the
// filesystem and are reserved for plugin-emitted virtual modules.
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`;

/**
 * Sentinel emitted by `load` for the virtual module. The bundler
 * inlines this string into whatever CSS asset our virtual module
 * lands in; `generateBundle` then sweeps the bundle and rewrites
 * the sentinel to the final aggregated CSS — by that point every
 * `transform` has fired and `aggregatedCss` is complete. Without
 * this two-phase trick, `load`'s synchronous result would be
 * captured before later files have a chance to extract.
 *
 * The `/*!` prefix marks the comment as "important" so CSS
 * minifiers (LightningCSS, esbuild, cssnano) preserve it through
 * the optimisation pass — a plain `/*` comment gets stripped.
 */
const PLACEHOLDER_SENTINEL = '/*!__motif_extract_placeholder__*/';

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
 * import motif from '@usemotif/compiler-swc';
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
    // CSS keyed by module id (insertion-ordered) rather than a flat
    // append-only array. The plugin instance is created once and reused
    // across rebuilds in watch mode; an array would grow without bound,
    // re-appending each changed module's CSS every rebuild and shipping
    // duplicates. Keying by id means a re-transform overwrites that
    // module's entry, and a module edited to emit no CSS clears it.
    const cssByModule = new Map<string, string[]>();

    return {
      name: '@usemotif/compiler-swc',
      enforce: 'pre',
      resolveId(id) {
        if (id === VIRTUAL_ID || id === VIRTUAL_ID_ALIAS) return RESOLVED_VIRTUAL_ID;
        return null;
      },
      load(id) {
        if (id === RESOLVED_VIRTUAL_ID) {
          return PLACEHOLDER_SENTINEL;
        }
        return null;
      },
      generateBundle(_options: NormalizedOutputOptions, bundle: OutputBundle) {
        const replacement = Array.from(cssByModule.values()).flat().join('\n');
        for (const file of Object.values(bundle)) {
          if (
            file.type === 'asset' &&
            typeof file.source === 'string' &&
            file.source.includes(PLACEHOLDER_SENTINEL)
          ) {
            file.source = file.source.replace(PLACEHOLDER_SENTINEL, replacement);
          }
        }
      },
      transformInclude(id) {
        return shouldTransform(id, include, exclude);
      },
      async transform(code, id) {
        // Reset this module's CSS contribution up front; onCss repopulates
        // it as styles extract. A re-transform (watch mode) thus replaces
        // the prior entry instead of duplicating, and a module that no
        // longer extracts any CSS ends up with an empty entry.
        const moduleCss: string[] = [];
        cssByModule.set(id, moduleCss);
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
                  moduleCss.push(css);
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
export const PACKAGE_NAME = '@usemotif/compiler-swc';
