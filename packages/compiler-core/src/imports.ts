import * as t from '@babel/types';
import type { PrimitiveBinding } from './types.js';

/**
 * Module specifiers that export motif primitives whose JSX call sites
 * we want to extract.
 *
 * Kept as a small allow-list (rather than auto-detecting by prop shape)
 * so that user-defined components that happen to accept a `bg` prop
 * aren't accidentally rewritten.
 */
export const DEFAULT_MOTIF_SOURCES: ReadonlySet<string> = new Set([
  // v2 names — added in compiler-core@2.0.0.
  'usemotif',
  '@usemotif/react',
  '@usemotif/react-native',
  // v1 name kept recognised for one major so consumers can bump the
  // compiler before migrating their import specifiers. Drop in
  // compiler-core@3.0.0.
  '@usemotif/react-web',
]);

/**
 * Names exported from a motif renderer that are extractable JSX primitives.
 *
 * `Theme` and `Container` are intentionally NOT in this set — they have
 * structural roles (theme cascade, container query host) that the compiler
 * shouldn't fold away.
 */
export const PRIMITIVE_NAMES: ReadonlySet<string> = new Set([
  'Box',
  'Stack',
  'HStack',
  'VStack',
  'Text',
  'Pressable',
  'Image',
]);

/**
 * Walk a Babel `Program` body for motif imports and return the local
 * bindings. Handles default + named + aliased forms:
 *
 *   import { Box } from '@usemotif/react';
 *   import { Box as MotifBox } from '@usemotif/react';
 *   import { Box } from 'usemotif';
 *
 * Re-exports (`export { Box } from ...`) and namespace imports
 * (`import * as Motif from ...`) are not tracked — they're rare in user
 * code and the compiler bailing out on them is harmless (the runtime
 * still works).
 */
export function findMotifBindings(
  programBody: readonly t.Statement[],
  sources: ReadonlySet<string> = DEFAULT_MOTIF_SOURCES,
  primitiveNames: ReadonlySet<string> = PRIMITIVE_NAMES,
): Map<string, PrimitiveBinding> {
  const out = new Map<string, PrimitiveBinding>();

  for (const stmt of programBody) {
    if (!t.isImportDeclaration(stmt)) continue;
    const source = stmt.source.value;
    if (!sources.has(source)) continue;

    for (const spec of stmt.specifiers) {
      if (!t.isImportSpecifier(spec)) continue;
      const importedName = t.isIdentifier(spec.imported) ? spec.imported.name : spec.imported.value;
      if (!primitiveNames.has(importedName)) continue;
      const localName = spec.local.name;
      out.set(localName, { localName, source, importedName });
    }
  }

  return out;
}

/**
 * Resolve a JSXOpeningElement's name to a motif binding, or `undefined`
 * if this isn't a motif primitive call site.
 *
 * Member expressions (`<Motif.Box>`) and namespaced names (`<svg:rect>`)
 * are not motif primitives in our allow-list, so they return `undefined`.
 */
export function bindingForJsxName(
  name: t.JSXOpeningElement['name'],
  bindings: ReadonlyMap<string, PrimitiveBinding>,
): PrimitiveBinding | undefined {
  if (!t.isJSXIdentifier(name)) return undefined;
  return bindings.get(name.name);
}
