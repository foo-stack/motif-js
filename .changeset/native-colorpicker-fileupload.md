---
'@motif-js/headless': minor
'@motif-js/react-native': patch
---

**Native `ColorPicker` and `FileUpload` — real implementations replace the null-render stubs.**

Closes T3.1b + T3.1c. Both were among the four stubbed native headless components flagged at v1.0 graduation; the remaining two (ContextMenu, TreeView) shipped earlier this milestone.

```tsx
// Native ColorPicker — gradients via react-native-svg (optional peer).
import { ColorPicker } from '@motif-js/headless';

const [colour, setColour] = useState('#3b82f6');
<ColorPicker value={colour} onValueChange={setColour} format="rgb" allowAlpha />;

// Native FileUpload — wraps expo-document-picker (optional peer).
import { FileUpload } from '@motif-js/headless';

<FileUpload accept="image/*" onFiles={(assets) => upload(assets)}>
  {({ openPicker }) => (
    <Pressable onPress={openPicker}>
      <Text>Pick a file</Text>
    </Pressable>
  )}
</FileUpload>;
```

**ColorPicker (T3.1b):**

- HSV picker driven by `PanResponder` — drag the saturation/value
  plane to pick chroma + brightness, the hue slider for hue, and the
  alpha slider for transparency (when `allowAlpha` is set and
  `format` is non-hex).
- Mirrors the web `ColorPicker` API surface — same props
  (`value`/`defaultValue`, `format`, `onFormatChange`, `allowAlpha`,
  `formats`, `disabled`, plus per-element style overrides scoped to
  `ViewStyle`).
- `react-native-svg` is an **optional peer** (`>=15.0.0`). When
  present, the SV plane and sliders render proper gradients via
  `Svg` + `Defs` + `LinearGradient` + `Stop` + `Rect`. Without it,
  the picker falls back to solid pure-hue / alpha-step backgrounds —
  still functional, just without gradient hinting. Apps that don't
  install the peer get a degraded but working picker; the dev gets
  no warning since this is a documented graceful-degradation path.
- `parseColor` and `formatColor` are pure JS and re-exported on
  native too — cross-platform colour code keeps working the same.
- `NATIVE_COLOR_PICKER_HAS_SVG` exported for tests / docs to
  feature-detect the gradient path.
- No keyboard navigation on native — touch is the only input
  surface. Voice-over reads the role + current value via
  `accessibilityRole="adjustable"` + `accessibilityValue`.

**FileUpload (T3.1c):**

- Wraps `expo-document-picker` when present (optional peer
  `>=11.0.0`). The render-prop receives the same
  `{ isDragging, openPicker }` shape as web; `openPicker()` calls
  `getDocumentAsync()` with the user-supplied `accept` /
  `multiple` / `copyToCacheDirectory: true` and routes the resulting
  `assets` to `onFiles` (skipping cancelled picks + zero-asset
  results).
- `isDragging` is always `false` on native (no drag-drop on mobile);
  the prop stays for cross-platform parity so the same render-prop
  works on both renderers.
- When the peer is missing (bare RN, no Expo): `openPicker` is a
  no-op that warns once via `nativeStubWarn`. The render-prop still
  fires so the dev sees the UI shell — it just can't actually pick.
  `NATIVE_FILE_UPLOAD_HAS_PICKER` is exported so apps can
  conditionally swap to a different solution at runtime.
- `onFiles` receives `DocumentPickerAsset[]` on native vs `File[]`
  on web — the asset shape is `{ uri, name?, mimeType?, size? }`.
  Apps that want cross-platform should branch on `Platform.OS` or
  type the consumer as `unknown[]`.

**Test infra:**

- Added `PanResponder` to the jsdom RN mock as a no-op shim
  (`{ panHandlers: { ...config } }`). The drag pipeline isn't
  exercised in tests — gestures don't translate to jsdom in any
  useful way — but the production code path needs `PanResponder` to
  be defined at module load. The gesture path is documented and
  trivially reviewable (each handler delegates to a single
  `update(GestureResponderEvent)` call that converts `locationX/Y`
  to normalised picker coordinates).
- 13 new ColorPicker tests covering render shape (SV plane / hue
  slider / alpha slider / format toggle), format toggle behaviour
  (controlled + uncontrolled), disabled state, controlled value
  re-parse, and the `parseColor` / `formatColor` round-trip.
- 6 new FileUpload tests covering render-prop shape, "no peer"
  fallback path, disabled state, accessibility-label propagation.
- Both test suites run through the gradient-less / no-Expo
  fallback paths because neither peer is installed in the headless
  package's devDependencies — that's the same path bare-RN apps
  see in production, so the conformance boundary is identical.

Total tests: 1,043 → 1,062 passing (+19); skipped unchanged at 9.
Bundle: `@motif-js/headless` 26.2 → 28.4 KB gz (+2.2 KB for the
two implementations + tryRequire + the SVG gradient layers — under
the ≤31.3 KB ceiling). `@motif-js/react-native` unchanged
(test-utils only — `PanResponder` shim).

**Closes Tier 3.** All 9 items are now done. Native picker
playground integration is captured separately under the v0.4.x
deferred-work window — peer-dep installation + visual validation
on a real device is part of the broader native-runtime polish.
