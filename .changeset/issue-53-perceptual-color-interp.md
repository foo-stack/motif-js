---
'@usemotif/core': minor
'@usemotif/react': minor
'@usemotif/react-native': minor
'usemotif': minor
---

`useTransform` color interpolation now recognises more formats and can interpolate in perceptually-uniform color spaces.

**New parsed formats:** `hsl()` / `hsla()`, `oklab()`, `oklch()`, and the 148 CSS named colors (`red`, `steelblue`, `rebeccapurple`, etc.).

**New `colorSpace` option** on the range form:

```tsx
useTransform(progress, [0, 1], ['#ff0000', '#0000ff'], { colorSpace: 'oklab' });
```

- `'srgb'` (default) — linear lerp of 8-bit channels, same as v1.
- `'oklab'` — perceptually uniform; saturated hue rotations stay vivid instead of muddying through grey.
- `'oklch'` — same as `oklab` but interpolates hue along the shortest arc.

Output is always emitted as `rgb()` / `rgba()` so every renderer accepts it without further work. Conversion math lives in the new `@usemotif/core` `color-spaces` module (uses Ottosson's OKLab matrices); also exports `parseColor`, `srgbToOklab`, `oklabToSrgb`, `interpolateInSpace`, and the `ColorSpace` / `ParsedColor` types.
