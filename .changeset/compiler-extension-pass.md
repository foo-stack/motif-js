---
'@motif-js/compiler-core': minor
'@motif-js/compiler-babel': minor
'@motif-js/test-utils': patch
---

**Compiler extension pass — motion props, animation presets, `<Theme>` chain pre-generation, and same-file `styled()` variant extraction.**

Closes T3.6 (re-scoped to a 6-feature compiler pass that shares JSX-walking + literal-evaluation infrastructure — see deferred-work entries from T1.1, T1.2, T1.4, T2.1, T2.2 collapsing back into a single milestone).

```tsx
// Compile-time motion + animation extraction (web).
<Box transition="opacity 200ms ease" />
//   → <div style={{ transition: 'opacity 200ms ease' }} />

<Box animation="bouncy" animateOnly={['transform']} />
//   → <div style={{ transition: 'transform var(--motif-anim-bouncy-duration) var(--motif-anim-bouncy-easing)' }} />

<Box exitStyle={{ opacity: 0 }} />
//   → <div className="m-x" />
//      with `.m-x[data-motif-state="exiting"] { opacity: 0; }` in the bundle CSS

// Same-file styled() variant extraction.
const Btn = styled(Box, { variants: { size: { sm: { p: 2 }, lg: { p: 8 } } } });
const App = () => <Btn size="sm" />;
//   → <div style={{ padding: 2 }} />
```

**What ships in this minor:**

- **Pseudo-state extraction** (`_hover` / `_focus` / `_active` / `_disabled`) was already shipped in compiler-core; this pass confirms differential parity across the conformance suite (3 pseudo-state cases now run through the compiler differential test alongside the runtime).

- **Web motion-prop extraction** (T1.1 deferral) — literal `transition`, `enterStyle`, `exitStyle`, `animation`, `animateOnly` props at the call site are recognised by the analyzer (new `motionProps` bag on `CallSiteAnalysis`) and applied by `extractWeb`:
  - `transition` (string or `TransitionObject` literal) → resolved via the runtime-shared `resolveTransitionToVars` and inlined into `style.transition`.
  - `exitStyle` → emitted as a class-scoped `[data-motif-state="exiting"]` pseudo rule (same selector the runtime injects).
  - `enterStyle` → left at runtime (first-paint overlay flipped by React state — no compile-time CSS representation).

- **Native motion-prop extraction** (T1.2 deferral) — recognised by the analyzer for classification correctness; `extractNative` deliberately doesn't reduce them to a StyleSheet entry (the runtime driver owns the entry/exit lifecycle on native; there is no StyleSheet equivalent for `transition` or `animation`). Coverage in `extract-native.test.ts`.

- **Animation-prop extraction** (T2.2 deferral) — literal `animation="<name>"` references resolve at compile time via `buildAnimationCss`; `transition` wins over `animation` when both are literal (mirrors runtime precedence). The emitted CSS uses `var(--motif-anim-<name>-{duration,easing})` references so theme switches still flip the timing through the cascade.

- **Theme-chain pre-generation** (T2.1 deferral) — new `findThemeChainCombos(programBody)` walks the JSX tree and returns the set of observed `<Theme name="...">` chain combinations (`{ "red", "red_blue" }`). The Babel plugin exposes the result via a new `onThemeChains(combos, filename)` option; host build tools combine the observed chains with each registered base theme to pre-generate just the cross-product CSS that's actually used. ThemeProvider's `active` prop is intentionally not folded into the chain — it's typically dynamic in real apps.

- **Variant-call extraction** (T1.4 deferral) — same-file `const X = styled(Y, { ... literal config ... })` declarations are tracked at Program-enter; at JSX call sites `<X size="sm" />` the variant prop is consumed, the merged style props (base + active variant case + matching compoundVariants + defaults) are spliced inline, and the wrapper is renamed to the underlying primitive (e.g. `<Box>`). The regular extract pipeline then runs as usual. Cross-file `styled()` definitions stay at runtime (Babel processes one file at a time). Function-form fallback variants (`'...size': (val) => ...`) bail to runtime because their bodies are opaque.

**Wrapper-stripping safety**: `enterStyle` joins Box/Stack/Text/HStack/VStack's `nonStrippableProps` set — the lowercase HTML element has no first-paint-overlay lifecycle, so the wrapper has to stay. Other motion props are safe to extract + strip (`transition` lands as a regular inline style, `exitStyle` lands as a class-scoped CSS rule that the parent boundary toggles via `data-motif-state`).

**Differential parity**: 6 conformance cases (`transition × 2`, `exitStyle`, `enterStyle (settled)`, `animation`, `animateOnly`) previously skipped on the compiler differential pass now run end-to-end. Total compiler-core suite: 140 tests pass, 0 skipped (was 97 + 6 skipped). Compiler-babel suite adds 22 new tests covering motion-prop extraction, theme-chain detection, and same-file styled() expansion (63 total, was 41).

Bundle: `compiler-core` 16.8 KB → 17.7 KB ESM (+0.9 KB for theme-chains + styled resolver). `compiler-babel` 6.0 KB → 7.4 KB ESM (+1.4 KB for the styled-binding scanner + JSX rewriter).

**Closes Tier 3.** Remaining T3.x items (T3.1b/c — native ColorPicker / FileUpload) sit in their own sub-tasks under T3.1.
