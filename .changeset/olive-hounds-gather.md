---
'@usemotif/headless': minor
'@usemotif/ui': minor
---

Make every compound component renderable from a React Server Component.

A client reference is a proxy that exposes named exports and nothing else, so
reaching through one never worked: `Dialog.Root`, where `Dialog` was an object
the client module exported, resolved to `undefined` and the render failed with
an invalid element type. Every namespace in both packages had that shape, and
the workaround was to wrap each use in a Client Component.

Both packages now ship a directive-free entry over client code that carries the
directive, and assemble their namespaces in that entry, so each property is
itself a client reference and a valid element type on either side of the
boundary. That covers all 17 namespaces in `@usemotif/headless` and all 7 in
`@usemotif/ui`.

Reuse between namespaces is resolved in the same place. `AlertDialog`, `Drawer`
and `Sheet` share four of Dialog's parts, `Accordion` shares two of
Collapsible's, `ContextMenu` shares Menu's separator, and `Select` and `Search`
share Combobox's input and list. A shared part is the identical reference, not a
copy.

Nothing is added to or removed from either public surface. `Dialog.Root` and its
peers stay the only documented way to reach a part, and the flattened parts the
entries are built from are internal.

Import cost falls, because a namespace built from plain bindings can be
tree-shaken where an object of components could not. Importing one headless
component drops by 14 to 24 percent depending on the component.

Two components still cannot be rendered from a Server Component, for a reason
unrelated to any of this: `CommandPalette` takes a `commands` array whose
entries carry `onSelect`, and `MultiSelect.Chips` takes a `renderChip` callback.
Functions cannot cross the boundary whatever shape the exports take.

Consumers importing either package from a Client Component are unaffected.
