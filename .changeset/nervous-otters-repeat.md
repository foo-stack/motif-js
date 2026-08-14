---
'@usemotif/core': minor
'@usemotif/react': minor
'@usemotif/react-native': minor
'@usemotif/compiler-core': minor
'@usemotif/compiler-babel': minor
'@usemotif/compiler-metro': minor
---

Add opt-in CSS cascade layer support via `<ThemeProvider cssLayer>`.

Motif emitted no `@layer` rules, so there was no way to place its styles below
an existing stylesheet in the cascade. Base style props resolve to inline
styles (`1,0,0,0`), which beat any host utility class (`0,1,0`) regardless of
authoring order, and runtime-injected rules land in `document.head` after the
bundled stylesheet — so neither specificity nor source order could express
"the app's stylesheet wins". That blocked incremental adoption alongside
Tailwind, where the established contract is the opposite.

```tsx
<ThemeProvider themes={themes} active="dark" cssLayer="motif">
```

```css
/* your stylesheet, loaded first — earlier layers lose */
@layer motif, app;
```

Setting `cssLayer` wraps everything Motif emits — the theme variable block,
the runtime block, responsive and container at-rules, pseudo-state rules and
`@keyframes` — in `@layer <name>`, and switches base style props from inline
styles to a class, since inline styles cannot participate in a layer.

A single layer is deliberate: inside it, specificity and source order still
apply, so every existing base → responsive → pseudo relationship is preserved.
Motif does not emit a layer _order_ statement — declare that yourself, or
precedence would depend on which stylesheet reached the DOM first.

Pass the same name to the compiler plugin (`cssLayer`), as with `breakpoints`
— the layer is part of the generated class name, so a mismatch stops compiled
and runtime rules deduplicating. The React Native provider accepts and ignores
it; native has no cascade.

Default behaviour is unchanged: with no `cssLayer`, emitted CSS and class
names are byte-identical to before.

Closes #319
