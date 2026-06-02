---
'@usemotif/react': patch
---

Fix `ZStack` so its children actually overlap. Each child's wrapper set both `grid-area: stack` and `display: contents`; a contents box generates no box, so its `grid-area` was ignored and the children became grid items of the ZStack grid, auto-placing into separate implicit rows instead of sharing the single cell. Dropping `display: contents` makes each wrapper the grid item that occupies the stack cell, restoring z-axis overlap.
