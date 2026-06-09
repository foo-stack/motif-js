'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

/**
 * Specialized — ColorPicker, FileUpload, TreeView.
 *
 * - ColorPicker: full HSV picker with saturation×value plane, hue slider,
 *   optional alpha slider, format toggle (hex / rgb / hsl). Keyboard +
 *   pointer driven; headless wiring (ARIA + state), no built-in styling
 *   beyond the minimum geometry needed for the drag surfaces.
 * - FileUpload wraps `<input type="file">` with a drag-drop region.
 * - TreeView is a real implementation: nested items, ARIA tree
 *   pattern (role="tree", role="treeitem", aria-expanded /
 *   aria-selected), arrow-key navigation.
 */

// ─────────── ColorPicker — HSV ────────────────────────────────────

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

interface HSVColor {
  /** 0..360 */ readonly h: number;
  /** 0..1 */ readonly s: number;
  /** 0..1 */ readonly v: number;
  /** 0..1 */ readonly a: number;
}

const HEX_RE = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_RE = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i;
const HSL_RE = /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)$/i;

/**
 * Best-effort colour-string parser. Handles `#rgb`, `#rgba`, `#rrggbb`,
 * `#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, `hsla()`. Falls back to opaque
 * black on unparseable input rather than throwing — UI controls expect
 * a value at all times.
 */
export function parseColor(input: string): HSVColor {
  const s = input.trim();
  const hex = HEX_RE.exec(s);
  if (hex !== null) {
    const body = hex[1]!;
    let r: number, g: number, b: number, a: number;
    if (body.length === 3) {
      r = parseInt(body[0]! + body[0], 16);
      g = parseInt(body[1]! + body[1], 16);
      b = parseInt(body[2]! + body[2], 16);
      a = 1;
    } else if (body.length === 4) {
      r = parseInt(body[0]! + body[0], 16);
      g = parseInt(body[1]! + body[1], 16);
      b = parseInt(body[2]! + body[2], 16);
      a = parseInt(body[3]! + body[3], 16) / 255;
    } else if (body.length === 6) {
      r = parseInt(body.slice(0, 2), 16);
      g = parseInt(body.slice(2, 4), 16);
      b = parseInt(body.slice(4, 6), 16);
      a = 1;
    } else {
      r = parseInt(body.slice(0, 2), 16);
      g = parseInt(body.slice(2, 4), 16);
      b = parseInt(body.slice(4, 6), 16);
      a = parseInt(body.slice(6, 8), 16) / 255;
    }
    return rgbToHsv(r, g, b, a);
  }
  const rgb = RGB_RE.exec(s);
  if (rgb !== null) {
    return rgbToHsv(
      Number(rgb[1]),
      Number(rgb[2]),
      Number(rgb[3]),
      rgb[4] !== undefined ? Number(rgb[4]) : 1,
    );
  }
  const hsl = HSL_RE.exec(s);
  if (hsl !== null) {
    return hslToHsv(
      Number(hsl[1]),
      Number(hsl[2]) / 100,
      Number(hsl[3]) / 100,
      hsl[4] !== undefined ? Number(hsl[4]) : 1,
    );
  }
  return { h: 0, s: 0, v: 0, a: 1 };
}

/** Format an HSV colour back to a CSS string in the requested format. */
export function formatColor(c: HSVColor, format: ColorFormat): string {
  if (format === 'hex') {
    const { r, g, b } = hsvToRgb(c.h, c.s, c.v);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  if (format === 'rgb') {
    const { r, g, b } = hsvToRgb(c.h, c.s, c.v);
    if (c.a < 1) return `rgba(${r}, ${g}, ${b}, ${round(c.a, 3)})`;
    return `rgb(${r}, ${g}, ${b})`;
  }
  // hsl
  const { h, s, l } = hsvToHsl(c.h, c.s, c.v);
  const sp = `${round(s * 100, 1)}%`;
  const lp = `${round(l * 100, 1)}%`;
  if (c.a < 1) return `hsla(${round(h, 1)}, ${sp}, ${lp}, ${round(c.a, 3)})`;
  return `hsl(${round(h, 1)}, ${sp}, ${lp})`;
}

function rgbToHsv(r: number, g: number, b: number, a: number): HSVColor {
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;
  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rf) h = ((gf - bf) / d) % 6;
    else if (max === gf) h = (bf - rf) / d + 2;
    else h = (rf - gf) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max, a: clamp01(a) };
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function hsvToHsl(h: number, s: number, v: number): { h: number; s: number; l: number } {
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return { h, s: sl, l };
}

function hslToHsv(h: number, s: number, l: number, a: number): HSVColor {
  const v = l + s * Math.min(l, 1 - l);
  const sv = v === 0 ? 0 : 2 * (1 - l / v);
  return { h, s: sv, v, a: clamp01(a) };
}

function toHex(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n)))
    .toString(16)
    .padStart(2, '0');
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function round(n: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

export interface ColorPickerProps {
  /** Current colour as a CSS string. Format follows `format`. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  /** Output format. Defaults to `'hex'`. */
  format?: ColorFormat;
  onFormatChange?: (next: ColorFormat) => void;
  /** When true (and format != 'hex'), render an alpha slider. */
  allowAlpha?: boolean;
  /** Format options shown in the toggle. Pass `[]` to hide. */
  formats?: ReadonlyArray<ColorFormat>;
  disabled?: boolean;
  /** Inline style for the picker root. */
  style?: CSSProperties;
  /** Inline style for the saturation×value plane wrapper. */
  saturationValueStyle?: CSSProperties;
  /** Inline style for the SV thumb. */
  saturationValueThumbStyle?: CSSProperties;
  /** Inline style for the hue slider track. */
  hueSliderStyle?: CSSProperties;
  /** Inline style for the alpha slider track. */
  alphaSliderStyle?: CSSProperties;
}

/**
 * Headless HSV colour picker.
 *
 * Drag the saturation×value plane to pick chroma + brightness, the hue
 * slider for hue, and the alpha slider for transparency (when enabled
 * and the format isn't `hex`). The format toggle round-trips the value
 * through `parseColor` / `formatColor` so callers can swap between
 * `hex`, `rgb`, and `hsl` representations of the same colour.
 *
 * Keyboard: arrow keys on the SV plane move the thumb; Shift+arrow takes
 * larger steps. Sliders use the standard slider keys (Arrow / Home / End
 * / PageUp / PageDown).
 *
 * ```tsx
 * const [value, setValue] = useState('#3b82f6');
 * <ColorPicker value={value} onValueChange={setValue} format="rgb" allowAlpha />
 * ```
 */
export function ColorPicker({
  value: controlled,
  defaultValue = '#000000',
  onValueChange,
  format: controlledFormat,
  onFormatChange,
  allowAlpha = false,
  formats = ['hex', 'rgb', 'hsl'],
  disabled = false,
  style,
  saturationValueStyle,
  saturationValueThumbStyle,
  hueSliderStyle,
  alphaSliderStyle,
}: ColorPickerProps): ReactElement {
  const [uncontrolledFormat, setUncontrolledFormat] = useState<ColorFormat>('hex');
  const isFormatControlled = controlledFormat !== undefined;
  const format = isFormatControlled ? controlledFormat : uncontrolledFormat;

  // Keep an internal HSV state so dragging in low-saturation / zero-value
  // regions doesn't lose hue information that doesn't survive the round-
  // trip through RGB.
  const [hsv, setHsv] = useState<HSVColor>(() => parseColor(controlled ?? defaultValue));
  const isControlled = controlled !== undefined;

  // Track the most recent value we emitted, so externally-changed
  // `value` updates re-parse but our own emissions don't loop.
  const lastEmittedRef = useRef<string | null>(controlled ?? null);

  useEffect(() => {
    if (!isControlled || controlled === undefined) return;
    if (controlled === lastEmittedRef.current) return;
    lastEmittedRef.current = controlled;
    setHsv(parseColor(controlled));
  }, [controlled, isControlled]);

  const commit = useCallback(
    (next: HSVColor) => {
      setHsv(next);
      const formatted = formatColor(next, format);
      lastEmittedRef.current = formatted;
      onValueChange?.(formatted);
    },
    [onValueChange, format],
  );

  const setFormat = useCallback(
    (next: ColorFormat) => {
      if (!isFormatControlled) setUncontrolledFormat(next);
      onFormatChange?.(next);
      // Re-emit the current colour in the new format so consumers see
      // the updated string immediately.
      const formatted = formatColor(hsv, next);
      lastEmittedRef.current = formatted;
      onValueChange?.(formatted);
    },
    [isFormatControlled, onFormatChange, onValueChange, hsv],
  );

  const setSV = useCallback(
    (s: number, v: number) => commit({ ...hsv, s: clamp01(s), v: clamp01(v) }),
    [hsv, commit],
  );
  const setHue = useCallback((h: number) => commit({ ...hsv, h: clampHue(h) }), [hsv, commit]);
  const setAlpha = useCallback((a: number) => commit({ ...hsv, a: clamp01(a) }), [hsv, commit]);

  const showAlpha = allowAlpha && format !== 'hex';

  return (
    <div role="group" aria-label="Colour picker" style={{ display: 'inline-block', ...style }}>
      <SaturationValuePlane
        hsv={hsv}
        disabled={disabled}
        onChange={setSV}
        style={saturationValueStyle}
        thumbStyle={saturationValueThumbStyle}
      />
      <HueSlider hue={hsv.h} disabled={disabled} onChange={setHue} style={hueSliderStyle} />
      {showAlpha ? (
        <AlphaSlider hsv={hsv} disabled={disabled} onChange={setAlpha} style={alphaSliderStyle} />
      ) : null}
      {formats.length > 0 ? (
        <FormatToggle format={format} options={formats} onChange={setFormat} />
      ) : null}
    </div>
  );
}

function clampHue(h: number): number {
  let n = h % 360;
  if (n < 0) n += 360;
  return n;
}

function SaturationValuePlane({
  hsv,
  disabled,
  onChange,
  style,
  thumbStyle,
}: {
  hsv: HSVColor;
  disabled: boolean;
  onChange: (s: number, v: number) => void;
  style?: CSSProperties | undefined;
  thumbStyle?: CSSProperties | undefined;
}): ReactElement {
  const planeRef = useRef<HTMLDivElement | null>(null);
  // Tear down an in-flight drag on unmount so a closing ColorPicker doesn't
  // leak the pointermove/pointerup listeners or fire onChange after unmount.
  const dragCleanupRef = useRef<(() => void) | null>(null);
  useEffect(() => () => dragCleanupRef.current?.(), []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>): void => {
    if (disabled) return;
    const plane = planeRef.current;
    if (plane === null) return;
    plane.setPointerCapture(e.pointerId);
    const update = (clientX: number, clientY: number): void => {
      const rect = plane.getBoundingClientRect();
      const s = clamp01((clientX - rect.left) / rect.width);
      const v = 1 - clamp01((clientY - rect.top) / rect.height);
      onChange(s, v);
    };
    update(e.clientX, e.clientY);
    const onMove = (mv: globalThis.PointerEvent): void => update(mv.clientX, mv.clientY);
    const cleanup = (): void => {
      plane.removeEventListener('pointermove', onMove);
      plane.removeEventListener('pointerup', onUp);
      plane.removeEventListener('pointercancel', onUp);
      dragCleanupRef.current = null;
    };
    const onUp = (): void => cleanup();
    plane.addEventListener('pointermove', onMove);
    plane.addEventListener('pointerup', onUp);
    plane.addEventListener('pointercancel', onUp);
    dragCleanupRef.current = cleanup;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) return;
    const step = e.shiftKey ? 0.1 : 0.01;
    let s = hsv.s;
    let v = hsv.v;
    switch (e.key) {
      case 'ArrowLeft':
        s -= step;
        break;
      case 'ArrowRight':
        s += step;
        break;
      case 'ArrowUp':
        v += step;
        break;
      case 'ArrowDown':
        v -= step;
        break;
      case 'Home':
        s = 0;
        v = 1;
        break;
      case 'End':
        s = 1;
        v = 0;
        break;
      default:
        return;
    }
    e.preventDefault();
    onChange(s, v);
  };

  return (
    <div
      ref={planeRef}
      // A 2D saturation/value control. `role="application"` suppressed
      // browse-mode for the whole subtree; `role="slider"` with an
      // `aria-valuetext` describing both axes is the safer model — it announces
      // the current position without trapping the reader in application mode.
      role="slider"
      aria-label="Saturation and value selector"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(hsv.s * 100)}
      aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, value ${Math.round(hsv.v * 100)}%`}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      style={{
        position: 'relative',
        userSelect: 'none',
        touchAction: 'none',
        outline: 'none',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${hsv.s * 100}%`,
          top: `${(1 - hsv.v) * 100}%`,
          ...thumbStyle,
        }}
      />
    </div>
  );
}

function HueSlider({
  hue,
  disabled,
  onChange,
  style,
}: {
  hue: number;
  disabled: boolean;
  onChange: (next: number) => void;
  style?: CSSProperties | undefined;
}): ReactElement {
  return (
    <ScalarSlider
      ariaLabel="Hue"
      min={0}
      max={360}
      step={1}
      value={hue}
      disabled={disabled}
      onChange={onChange}
      style={style}
    />
  );
}

function AlphaSlider({
  hsv,
  disabled,
  onChange,
  style,
}: {
  hsv: HSVColor;
  disabled: boolean;
  onChange: (next: number) => void;
  style?: CSSProperties | undefined;
}): ReactElement {
  return (
    <ScalarSlider
      ariaLabel="Alpha"
      min={0}
      max={1}
      step={0.01}
      value={hsv.a}
      disabled={disabled}
      onChange={onChange}
      style={style}
    />
  );
}

function ScalarSlider({
  ariaLabel,
  min,
  max,
  step,
  value,
  disabled,
  onChange,
  style,
}: {
  ariaLabel: string;
  min: number;
  max: number;
  step: number;
  value: number;
  disabled: boolean;
  onChange: (next: number) => void;
  style?: CSSProperties | undefined;
}): ReactElement {
  const trackRef = useRef<HTMLDivElement | null>(null);
  // Tear down an in-flight drag on unmount (leak / setState-after-unmount guard).
  const dragCleanupRef = useRef<(() => void) | null>(null);
  useEffect(() => () => dragCleanupRef.current?.(), []);
  const setValue = useCallback(
    (n: number) => {
      onChange(Math.max(min, Math.min(max, n)));
    },
    [onChange, min, max],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) return;
    const big = step * 10;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        setValue(value + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        setValue(value - step);
        break;
      case 'PageUp':
        setValue(value + big);
        break;
      case 'PageDown':
        setValue(value - big);
        break;
      case 'Home':
        setValue(min);
        break;
      case 'End':
        setValue(max);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>): void => {
    if (disabled) return;
    const track = trackRef.current;
    if (track === null) return;
    track.setPointerCapture(e.pointerId);
    const update = (clientX: number): void => {
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      setValue(min + ratio * (max - min));
    };
    update(e.clientX);
    const onMove = (mv: globalThis.PointerEvent): void => update(mv.clientX);
    const cleanup = (): void => {
      track.removeEventListener('pointermove', onMove);
      track.removeEventListener('pointerup', onUp);
      track.removeEventListener('pointercancel', onUp);
      dragCleanupRef.current = null;
    };
    const onUp = (): void => cleanup();
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', onUp);
    track.addEventListener('pointercancel', onUp);
    dragCleanupRef.current = cleanup;
  };

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      style={{
        position: 'relative',
        userSelect: 'none',
        touchAction: 'none',
        outline: 'none',
        ...style,
      }}
    >
      <div style={{ position: 'absolute', left: `${percent}%`, top: 0, bottom: 0 }} />
    </div>
  );
}

function FormatToggle({
  format,
  options,
  onChange,
}: {
  format: ColorFormat;
  options: ReadonlyArray<ColorFormat>;
  onChange: (next: ColorFormat) => void;
}): ReactElement {
  const groupId = useId();
  // APG radiogroup: a single tab stop (roving tabindex) plus arrow-key
  // movement, not every radio tabbable with no keyboard navigation.
  const selectedIdx = Math.max(0, options.indexOf(format));

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number): void => {
    let nextIdx: number;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIdx = (idx + 1) % options.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIdx = (idx - 1 + options.length) % options.length;
    } else {
      return;
    }
    e.preventDefault();
    onChange(options[nextIdx]!);
    // Move focus to follow selection (radios select on arrow per APG).
    const radios = document
      .getElementById(groupId)
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    radios?.[nextIdx]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Colour format" id={groupId}>
      {options.map((opt, idx) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={opt === format}
          tabIndex={idx === selectedIdx ? 0 : -1}
          onKeyDown={(e) => onKeyDown(e, idx)}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─────────── FileUpload ───────────────────────────────────────────

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFiles?: (files: File[]) => void;
  /** Render fn for the drop zone. Receives `{ isDragging,
   * openPicker }`. */
  children: (info: { isDragging: boolean; openPicker: () => void }) => ReactNode;
  style?: CSSProperties;
}
export function FileUpload({
  accept,
  multiple = false,
  disabled = false,
  onFiles,
  children,
  style,
}: FileUploadProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  // Depth counter: dragenter/dragleave both bubble from descendants, so a
  // plain boolean flickered off every time the pointer crossed between
  // child elements of the drop zone. Every dragenter pairs with a
  // dragleave, so the count only reaches 0 when the pointer truly leaves.
  const dragDepthRef = useRef(0);
  const id = useId();

  const handleFiles = useCallback(
    (list: FileList | null): void => {
      if (list === null || list.length === 0) return;
      onFiles?.(Array.from(list));
    },
    [onFiles],
  );

  function onDragEnter(e: DragEvent<HTMLDivElement>): void {
    if (disabled) return;
    e.preventDefault();
    dragDepthRef.current += 1;
    setIsDragging(true);
  }
  function onDragOver(e: DragEvent<HTMLDivElement>): void {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }
  function onDragLeave(): void {
    if (disabled) return;
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDragging(false);
  }
  function onDrop(e: DragEvent<HTMLDivElement>): void {
    if (disabled) return;
    e.preventDefault();
    dragDepthRef.current = 0;
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }
  function openPicker(): void {
    if (!disabled) inputRef.current?.click();
  }

  return (
    <div
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={style}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
      />
      {children({ isDragging, openPicker })}
    </div>
  );
}

// ─────────── TreeView ─────────────────────────────────────────────

export interface TreeNode<T = unknown> {
  readonly id: string;
  readonly label: ReactNode;
  readonly data?: T;
  readonly children?: ReadonlyArray<TreeNode<T>>;
  readonly disabled?: boolean;
}

export interface TreeViewProps<T = unknown> {
  data: ReadonlyArray<TreeNode<T>>;
  /** Currently-selected node id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  /** Initially-expanded ids. */
  defaultExpanded?: ReadonlyArray<string>;
  /** Render fn for each node. */
  renderNode: (info: {
    node: TreeNode<T>;
    depth: number;
    isExpanded: boolean;
    isSelected: boolean;
    isFocused: boolean;
    toggle: () => void;
    select: () => void;
  }) => ReactElement;
  style?: CSSProperties;
  'aria-label'?: string;
}

interface FlatNode<T> {
  readonly node: TreeNode<T>;
  readonly depth: number;
  readonly parentExpanded: boolean;
}

function flatten<T>(
  nodes: ReadonlyArray<TreeNode<T>>,
  expanded: Set<string>,
  depth = 0,
  parentExpanded = true,
): FlatNode<T>[] {
  const out: FlatNode<T>[] = [];
  for (const n of nodes) {
    out.push({ node: n, depth, parentExpanded });
    if (n.children !== undefined && expanded.has(n.id)) {
      out.push(...flatten(n.children, expanded, depth + 1, parentExpanded));
    }
  }
  return out;
}

export function TreeView<T>({
  data,
  value: controlled,
  defaultValue,
  onValueChange,
  defaultExpanded = [],
  renderNode,
  style,
  ...aria
}: TreeViewProps<T>): ReactElement {
  const [uncontrolled, setUncontrolled] = useState<string | undefined>(defaultValue);
  const isControlled = controlled !== undefined;
  const selected = isControlled ? controlled : uncontrolled;
  const setSelected = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));
  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const [focusedId, setFocusedId] = useState<string | undefined>(selected);

  const flat = useMemo(() => flatten(data, expanded), [data, expanded]);
  const focusedIndex = flat.findIndex((f) => f.node.id === focusedId);

  // Roving focus + tab stop. When nothing is focused yet, the first item is
  // the single tab stop so the tree is reachable; tabbing in (onFocus) seeds
  // `focusedId`. When `focusedId` changes via the arrow keys we move real
  // DOM focus to that item — but only while focus is already inside the tree
  // — otherwise arrow keys merely update state and assistive tech never
  // announces the active node (the container kept focus).
  const treeRef = useRef<HTMLDivElement>(null);
  const focusedItemRef = useRef<HTMLDivElement>(null);
  const tabbableId = focusedIndex >= 0 ? focusedId : flat[0]?.node.id;
  useEffect(() => {
    if (focusedId !== undefined && treeRef.current?.contains(document.activeElement)) {
      focusedItemRef.current?.focus();
    }
  }, [focusedId]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
    if (focusedIndex === -1) return;
    const current = flat[focusedIndex]!;
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const next = flat[focusedIndex + 1];
        if (next !== undefined) setFocusedId(next.node.id);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = flat[focusedIndex - 1];
        if (prev !== undefined) setFocusedId(prev.node.id);
        break;
      }
      case 'ArrowRight':
        e.preventDefault();
        if (current.node.children !== undefined && !expanded.has(current.node.id)) {
          toggle(current.node.id);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (current.node.children !== undefined && expanded.has(current.node.id)) {
          // Expanded parent → collapse it.
          toggle(current.node.id);
        } else {
          // Collapsed node or leaf → move focus to the parent (the nearest
          // preceding item at a shallower depth), per the APG tree pattern.
          // Without this, ArrowLeft on a leaf is a dead end — you can descend
          // but never climb back out with the keyboard.
          for (let i = focusedIndex - 1; i >= 0; i--) {
            if (flat[i]!.depth < current.depth) {
              setFocusedId(flat[i]!.node.id);
              break;
            }
          }
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        setSelected(current.node.id);
        break;
    }
  }

  return (
    <div ref={treeRef} role="tree" onKeyDown={onKeyDown} style={style} {...aria}>
      {flat.map(({ node, depth }) => {
        const isExpanded = expanded.has(node.id);
        const isSelected = selected === node.id;
        const isFocused = focusedId === node.id;
        return (
          <div
            key={node.id}
            ref={isFocused ? focusedItemRef : undefined}
            role="treeitem"
            aria-level={depth + 1}
            aria-expanded={node.children !== undefined ? isExpanded : undefined}
            aria-selected={isSelected}
            aria-disabled={node.disabled || undefined}
            tabIndex={node.id === tabbableId ? 0 : -1}
            onFocus={() => setFocusedId(node.id)}
          >
            {renderNode({
              node,
              depth,
              isExpanded,
              isSelected,
              isFocused,
              toggle: () => toggle(node.id),
              select: () => setSelected(node.id),
            })}
          </div>
        );
      })}
    </div>
  );
}
