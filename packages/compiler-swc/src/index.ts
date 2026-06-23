/**
 * @deprecated Renamed to `@usemotif/compiler-web`.
 *
 * This plugin is Babel-via-`unplugin`, never SWC — the `-swc` name was a
 * misnomer. The package now lives at `@usemotif/compiler-web` (the web-bundler
 * counterpart to `@usemotif/compiler-metro`). This entry re-exports it
 * unchanged so existing imports keep working; it will be removed in a future
 * major. Switch your import to `@usemotif/compiler-web`.
 */
export * from '@usemotif/compiler-web';
export { default } from '@usemotif/compiler-web';
