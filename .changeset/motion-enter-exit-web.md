---
'@motif-js/core': minor
'@motif-js/react-web': minor
'@motif-js/tokens': minor
'@motif-js/headless': minor
'@motif-js/test-utils': minor
---

**Web mount/unmount transitions: `enterStyle`, `exitStyle`, `transition`.**

Three new motion props are accepted on every styled primitive on web
(`Box` and everything that extends `BoxProps` — `Stack`, `Heading`,
`Card`, `Field`, etc.).

```tsx
<Box
  enterStyle={{ opacity: 0, transform: 'translateY(8px)' }}
  exitStyle={{ opacity: 0 }}
  transition={{ property: 'all', duration: '$durations.3', easing: '$easings.standard' }}
>
  …
</Box>
```

- `transition` accepts a literal CSS string, a declarative object
  (`{ property, duration, easing, delay }`), or an array of those.
  Token references resolve via the new `durations` and `easings`
  scales (defaults shipped in `@motif-js/tokens`).
- `enterStyle` runs once on first client mount: the element paints
  with the enter-overlay style applied, then `requestAnimationFrame`
  swaps to the target style and the browser interpolates via
  `transition`. **SSR omits `enterStyle`** so server-rendered content
  has no FOUC and no hydration mismatch — entry animations run on
  client-mounted elements only.
- `exitStyle` is emitted as a CSS rule keyed on
  `[data-motif-state="exiting"]`. Exit-aware boundaries
  (`Dialog.Content` in this release) own the unmount choreography:
  flip `data-motif-state` to `"exiting"`, listen for `transitionend`
  or fall back to a timer, then unmount.

`@motif-js/headless` exposes a new `useExitTransition(open,
fallbackDurationMs)` hook used by `Dialog.Content`. Pass
`<Dialog.Content exitDurationMs={300}>` to opt into exit
animations; the default remains instant unmount for backwards
compatibility.

A new dev-only warning fires when `enterStyle` or `exitStyle` is set
without a `transition` (the change would otherwise be instantaneous).
Like the focus warning, it is wrapped in `process.env.NODE_ENV !==
'production'` and tree-shaken by bundlers.

Three Box-targeted conformance cases assert the runtime behaviour
(`expectStyle.transition`, `expectPseudoRules['[data-motif-state=
"exiting"]']`). They run on web and skip on native (T1.2 brings the
native motion driver) and on the compiler differential pass (T3.6
brings compiler-side extraction). The `skipOnRenderer` field on
`ConformanceCase` now covers `'compiler'` as a runner alongside
`'react-native'`.

`Drawer` inherits the `Dialog.Content` exit contract for free.
`Popover` and `Toast` adoption of the boundary contract is tracked
as a follow-on.
