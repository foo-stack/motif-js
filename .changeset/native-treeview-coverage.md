---
'@motif-js/headless': patch
---

**Native `<TreeView>` — formal acceptance closed (T3.1d).**

The native TreeView runtime was already implemented in
`packages/headless/src/specialized.native.tsx` from a prior phase
(direct port using `ScrollView` + recursive `View` rows with
`accessibilityRole` / `accessibilityState` hooks for screen
readers). This commit adds dedicated test coverage to formally
close T3.1d's acceptance.

7 new unit tests in `TreeView.native.test.tsx` mirror the web
`TreeView.test.tsx` shape — render → roles → expand-toggle →
selection → controlled mode → disabled — adapted for the native
API (no keyboard navigation: native consumers tap rows rather than
ArrowKeys + Enter). Tests run against the `react-native` jsdom
mock from `@motif-js/react-native` (aliased in headless's
vitest.config.ts via the harness shipped alongside T3.1a's native
ContextMenu work).

No runtime changes — the implementation was already in place and
matched the documented behaviour. Prior to this commit it lacked
unit tests because no native test harness existed for the headless
package; the harness now reuses RN's mock so the tests are cheap to
add.
