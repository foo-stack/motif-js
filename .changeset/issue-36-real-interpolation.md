---
'@usemotif/core': minor
'@usemotif/react': minor
'@usemotif/react-native': minor
---

Real interpolation in `useTransform` for non-numeric output ranges — color and unit-matched strings now blend across segments instead of step-functioning at the boundary.

```tsx
// Color: hex / rgb / rgba — interpolated in sRGB
const heroColor = useTransform(scrollYProgress, [0, 1], ['#ff0000', '#0000ff']);
// At t=0.5 → 'rgb(128, 0, 128)'

// Unit-matched length strings — strip unit, lerp, re-append
const radius = useTransform(progress, [0, 1], ['8px', '16px']);
// At t=0.5 → '12px'

// Mixed / unrecognised strings — still step at boundaries (v1 behaviour preserved)
const display = useTransform(t, [0, 1], ['flex', 'block']);
```

The output range is classified once at hook setup (memoised against array identity):

- **`numeric`** — all entries are numbers; piecewise-linear lerp (unchanged).
- **`color`** — all entries parse as hex (`#rgb` / `#rrggbb` / `#rrggbbaa`) or `rgb()` / `rgba()`. Interpolation is linear in sRGB; alpha interpolates too. Output collapses to `rgb(...)` when both endpoints are fully opaque.
- **`unit-matched`** — all entries match the same CSS length unit (`'8px' / '16px'`, `'1rem' / '2rem'`, `'25% / '75%'`). The unit is stripped, the numeric part is lerped, the unit is re-appended.
- **`step`** — anything else falls back to the segment's starting value (the v1 behaviour, unchanged).

The classifier handles a mix of hex and `rgb()` in the same range (both parse as colors), but mixing colors with non-color strings, or mixing units (`'8px' / '1rem'`), drops to step.

Out of scope for this PR (filed as separate follow-ups):

- Token-string outputs (`'$colors.brand.red'`) — `useTransform` doesn't read the theme. Use the function form (`useTransform(source, (v) => …)`) with theme-aware logic in the meantime.
- HSL / OKLab / OKLCh inputs.
- Perceptually-uniform interpolation (OKLab) — v1 uses linear sRGB which can produce muddy mid-points for high-saturation hue shifts.

New exports from `@usemotif/core`:

- `classifyOutputRange(outputRange)` — returns `'numeric' | 'color' | 'unit-matched' | 'step'`
- `interpolateOutputs(kind, low, high, t)` — interpolate a single segment via the classification
- `OutputRangeKind` type
