/**
 * Dev-only warning: fires when `styled()` is handed a string element type on
 * native.
 *
 * There is no native `button` or `span` to render, so the tag is dropped and a
 * plain `Box` (RN `View`) is rendered in its place. Cross-platform code that
 * writes `styled('button', ...)` therefore gets a real `<button>` on web and an
 * inert `View` on native - no press handling, no accessibility role - which is
 * almost never what the author intended.
 *
 * Wrapped in `process.env.NODE_ENV !== 'production'` so production bundles
 * tree-shake the call. The body is guarded too, so direct callers (tests) get
 * the production no-op when `NODE_ENV === 'production'`. Each unique tag warns
 * at most once per process to keep dev consoles quiet.
 */
export function warnStringTagOnNative(tag: string): void {
  if (process.env.NODE_ENV === 'production') return;

  if (stringTagWarned.has(tag)) return;
  stringTagWarned.add(tag);

  // eslint-disable-next-line no-console
  console.warn(
    `[motif] styled('${tag}', …) — string element types have no native ` +
      `equivalent and render as a plain <View>. Pass a component instead ` +
      `(e.g. \`styled(Pressable, …)\`, \`styled(Text, …)\`, \`styled(Box, …)\`) ` +
      `so the component behaves the same on both platforms.`,
  );
}

const stringTagWarned = new Set<string>();

/** Test-only: reset the warning dedup cache. */
export function _resetDevWarningsForTesting(): void {
  stringTagWarned.clear();
}
