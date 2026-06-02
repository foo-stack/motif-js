---
'@usemotif/compiler-core': patch
'@usemotif/compiler-babel': patch
---

Fix four compiler/runtime divergences. The wrapper-stripping pass no longer strips primitives that carry runtime-only behavior the compiler can't yet replicate — `_before`/`_after` (pseudo-element rules), `Text` `lines` (line-clamp), and `Stack`/`HStack`/`VStack` `stagger` — so those props are honored at runtime instead of being dropped and leaked onto the DOM as invalid attributes. Native extraction no longer extracts only the `base` slot of a responsive value (object, array, or DSL string) and consumes the prop, which pinned the element to `base` at every breakpoint; responsive props are now left entirely for the native runtime to resolve. The Babel plugin merges a dynamic `className` with `[...].filter(Boolean).join(' ')` instead of raw `+` concatenation, so a falsy value no longer stringifies into the class list — matching the runtime.
