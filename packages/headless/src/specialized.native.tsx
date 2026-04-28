import { useCallback, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { ScrollView, View, type ViewStyle } from 'react-native';
import { nativeStubWarn } from './_native-stub.js';

/**
 * Native specialized family — ColorPicker / FileUpload / TreeView.
 *
 * `parseColor` and `formatColor` are pure JS and work identically on
 * web and native, so they're re-exported here so cross-platform
 * theming code keeps working.
 *
 * The interactive components null-render and warn once. Real ports:
 * - ColorPicker — gated on react-native-svg gradients (FINE_TUNE #7
 *   landed); next iteration can canvas the saturation/value plane.
 * - FileUpload — `expo-document-picker` /
 *   `react-native-document-picker` peer dep.
 * - TreeView — direct port via Pressable + recursive layout.
 */

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

interface HSVColor {
  readonly h: number;
  readonly s: number;
  readonly v: number;
  readonly a: number;
}

const HEX_RE = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_RE = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i;
const HSL_RE = /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)$/i;

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
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  format?: ColorFormat;
  onFormatChange?: (next: ColorFormat) => void;
  allowAlpha?: boolean;
  formats?: ReadonlyArray<ColorFormat>;
  disabled?: boolean;
}
export function ColorPicker(_props: ColorPickerProps): ReactElement | null {
  nativeStubWarn('ColorPicker');
  return null;
}

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFiles?: (files: unknown[]) => void;
  children: (info: { isDragging: boolean; openPicker: () => void }) => ReactNode;
}
export function FileUpload(_props: FileUploadProps): ReactElement | null {
  nativeStubWarn('FileUpload');
  return null;
}

export interface TreeNode<T = unknown> {
  readonly id: string;
  readonly label: ReactNode;
  readonly data?: T;
  readonly children?: ReadonlyArray<TreeNode<T>>;
  readonly disabled?: boolean;
}
export interface TreeViewProps<T = unknown> {
  data: ReadonlyArray<TreeNode<T>>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  defaultExpanded?: ReadonlyArray<string>;
  renderNode: (info: {
    node: TreeNode<T>;
    depth: number;
    isExpanded: boolean;
    isSelected: boolean;
    isFocused: boolean;
    toggle: () => void;
    select: () => void;
  }) => ReactElement;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

interface FlatNode<T> {
  readonly node: TreeNode<T>;
  readonly depth: number;
  readonly parentChain: string[];
}
function flatten<T>(
  nodes: ReadonlyArray<TreeNode<T>>,
  expanded: ReadonlySet<string>,
  depth: number,
  parentChain: string[],
  out: FlatNode<T>[],
): void {
  for (const n of nodes) {
    out.push({ node: n, depth, parentChain });
    if (n.children !== undefined && expanded.has(n.id)) {
      flatten(n.children, expanded, depth + 1, [...parentChain, n.id], out);
    }
  }
}

export function TreeView<T>({
  data,
  value: controlledValue,
  defaultValue,
  onValueChange,
  defaultExpanded = [],
  renderNode,
  accessibilityLabel,
  style,
}: TreeViewProps<T>): ReactElement {
  const [valueUncontrolled, setValueUncontrolled] = useState<string | undefined>(defaultValue);
  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : valueUncontrolled;

  const select = useCallback(
    (id: string) => {
      if (!isValueControlled) setValueUncontrolled(id);
      onValueChange?.(id);
    },
    [isValueControlled, onValueChange],
  );

  const [expanded, setExpanded] = useState<ReadonlySet<string>>(() => new Set(defaultExpanded));
  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const flat = useMemo<FlatNode<T>[]>(() => {
    const out: FlatNode<T>[] = [];
    flatten(data, expanded, 0, [], out);
    return out;
  }, [data, expanded]);

  return (
    <ScrollView accessibilityRole="list" accessibilityLabel={accessibilityLabel} style={style}>
      <View accessibilityRole="list">
        {flat.map(({ node, depth }) => {
          const isExpanded = expanded.has(node.id);
          const isSelected = value === node.id;
          return (
            <View key={node.id} accessibilityState={{ expanded: isExpanded, selected: isSelected }}>
              {renderNode({
                node,
                depth,
                isExpanded,
                isSelected,
                isFocused: isSelected,
                toggle: () => toggle(node.id),
                select: () => {
                  if (node.disabled === true) return;
                  select(node.id);
                },
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
