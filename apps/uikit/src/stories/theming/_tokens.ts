// Shared token-introspection helpers for the theming stories. Walks the
// shipped `lightTheme` structure so the reference renders from the real token
// tree (it can't drift from the source). Not a story file — excluded from the
// stories glob by the leading underscore + `.ts` extension.
import { lightTheme } from '@usemotif/tokens';

type ColorNode = string | { readonly [k: string]: ColorNode };

export interface ColorLeaf {
  /** Dot path within `colors`, e.g. `surface.base` or `blue.500`. */
  readonly path: string;
  /** Full token string for use in style props, e.g. `$colors.surface.base`. */
  readonly token: string;
}

function walk(node: ColorNode, path: string, out: ColorLeaf[]): void {
  if (typeof node === 'string') {
    out.push({ path, token: `$colors.${path}` });
    return;
  }
  for (const [k, v] of Object.entries(node)) walk(v, path === '' ? k : `${path}.${k}`, out);
}

/** Color leaves grouped by their top-level key (surface, action, blue, …). */
export function colorGroups(): Record<string, ColorLeaf[]> {
  const colors = lightTheme.tokens.colors as Record<string, ColorNode>;
  const groups: Record<string, ColorLeaf[]> = {};
  for (const [group, node] of Object.entries(colors)) {
    const leaves: ColorLeaf[] = [];
    walk(node, group, leaves);
    groups[group] = leaves;
  }
  return groups;
}

/** A flat numeric/string scale (space, radii, fontSizes, …) as ordered pairs. */
export function scaleEntries(
  scale: keyof typeof lightTheme.tokens,
): ReadonlyArray<readonly [string, number | string]> {
  const obj = lightTheme.tokens[scale] as Record<string, number | string>;
  return Object.entries(obj);
}
