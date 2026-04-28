# vs NativeWind

[NativeWind](https://www.nativewind.dev) brings Tailwind to React
Native. It compiles `className="p-4 bg-blue-500"` strings into RN
`StyleSheet` objects via a Babel preset. The mental model is
"Tailwind that works on RN" — the calling convention is identical
to web Tailwind.

motif and NativeWind solve different problems with overlapping
surface area. The key axes:

## Design philosophy

| Axis                | NativeWind                           | motif                                |
| ------------------- | ------------------------------------ | ------------------------------------ |
| API style           | Tailwind class strings               | Style props (`p="$4"`)               |
| Type-safety         | String — no autocomplete on values   | Fully typed token references         |
| Platform target     | RN first; web via `react-native-web` | Web + RN + desktop, native bundles   |
| Compilation         | Babel preset (required for web)      | Babel optional (runtime works alone) |
| Theming             | `tailwind.config.js` extension       | Two-layer JS theme objects           |
| Headless components | None — bring your own                | `@motif-js/headless` (~36)           |

## Type-safety

The biggest practical difference. NativeWind:

```tsx
<View className="p-4 bg-blue-500" />
```

The `className` value is a string. TypeScript can't catch typos
(`bg-blue-50O` compiles, runs as a no-op). Editors don't autocomplete
token names. You lean on Tailwind plugins for sort/lint, but the
language server can't help.

motif:

```tsx
<Box p="$4" bg="$colors.brand.500" />
```

`p` and `bg` are typed props with autocomplete on token paths.
Typos fail at typecheck time. The `$colors.brand.500` reference
is computed against your `Theme` object, so renaming a token
breaks the build instead of silently dropping the style.

This isn't a small thing in practice — the main authoring
experience improvement when teams switch from Tailwind to motif
is the editor support.

## Performance

NativeWind's web target requires the Babel preset; without it,
classes don't resolve. We don't include NativeWind in
`benchmarks/render` because the SSR setup needs Metro / Tailwind
in the build pipeline, which a vitest harness can't reasonably
stand up.

A real apples-to-apples comparison needs a deployment-equivalent
setup (Metro for native, webpack+postcss-tailwind for web). Both
libraries land in similar ballparks once their compilers run; the
difference is what you pay when something can't compile (NativeWind
breaks; motif falls back to its runtime).

## Cross-platform story

NativeWind is RN-first. Its web target is real (it powers the
docs site), but it routes through `react-native-web` — every `<View>`
becomes a `<div>` rendered by the RN-Web shim. That's an additional
runtime layer between your code and the DOM.

motif's web package (`@motif-js/react-web`) renders directly to
DOM nodes. There's no RN-Web in the web build. The trade: motif
ships two implementations (one per platform) instead of one
shimmed across platforms.

If you mix motif primitives with hand-written CSS / Tailwind on
the web, motif fits cleanly — its output is just `className=` and
`style=` on real DOM elements. NativeWind's web target needs the
RN-Web shim regardless.

## When to pick which

**Pick NativeWind if:**

- Your team is fluent in Tailwind and prefers the class-string
  authoring style. The muscle memory transfers.
- You're building RN-only and want zero authoring delta from the
  web Tailwind workflow.
- You want to stay inside Tailwind's ecosystem (plugins, presets,
  community designs).

**Pick motif if:**

- Type-safety on tokens matters — autocomplete, rename refactors,
  catching typos at build time.
- You ship cross-platform and want a real DOM build on the web
  side, not RN-Web.
- You want token references that resolve through a typed theme
  object, not Tailwind's flat utility namespace.
- You want headless components shipped with the library, not
  assembled separately.

You can also use both — Tailwind class strings on the web and
motif primitives on RN — but the friction of mixing two systems
usually isn't worth it.

## See also

- [Migration guide: NativeWind → motif](../migration/from-nativewind)
- [Theming guide](../guides/theming)
- [Responsive guide](../guides/responsive)
