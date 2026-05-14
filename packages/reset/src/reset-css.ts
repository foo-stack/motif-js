/**
 * Motif's opt-in CSS reset. Audited against
 * [modern-normalize](https://github.com/sindresorhus/modern-normalize)
 * and [Tailwind preflight](https://tailwindcss.com/docs/preflight)
 * with a small set of deliberate deviations:
 *
 * - **No `font-family: system-ui, sans-serif` default.** Motif themes
 *   own typography via the `fontFamilies` token scale; an
 *   unconditional `system-ui` here would clobber a theme-set body
 *   font on first paint.
 * - **No global `text-decoration: none` on links.** Removing
 *   underlines silently is a usability regression; consumers can opt
 *   in per-component via `<Link>` or a Box-level style prop.
 * - **`button { all: unset }` is not used.** Tailwind's preflight
 *   strips the OS-level button styling but keeps `cursor: pointer`;
 *   we follow the same line. `all: unset` removes too much (focus
 *   ring on Safari, default `type="submit"` on form submission).
 *
 * The reset is a single static string. Inject once per document via
 * `<MotifReset />` (SSR-friendly), `injectResetStylesheet()`
 * (imperative, browser-only), or the auto-inject side-effect of
 * `import '@usemotif/reset/auto'`.
 */
export const RESET_CSS = `*,*::before,*::after{box-sizing:border-box}html{-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;line-height:1.15}body{margin:0;line-height:inherit}h1,h2,h3,h4,h5,h6,p,figure,blockquote,dl,dd{margin:0}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}ol,ul,menu{list-style:none;margin:0;padding:0}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}button,select,optgroup,textarea,input{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type='button'],[type='reset'],[type='submit']{-webkit-appearance:button;background-color:transparent;background-image:none;cursor:pointer}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}fieldset{margin:0;padding:0}legend{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:inherit}[role='button'],button{cursor:pointer}:disabled{cursor:default}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}`;

/** `id` set on the auto-injected `<style>` element so re-imports
 * dedupe (a second `import '@usemotif/reset/auto'` is a no-op). */
export const RESET_STYLE_ID = 'motif-reset';
