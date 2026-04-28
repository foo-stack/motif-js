/**
 * Per-primitive metadata used by the wrapper-stripping pass.
 *
 * The compiler can replace a fully-static motif primitive call with the
 * underlying lowercase HTML element when:
 *  - the primitive is `strippable`,
 *  - the user didn't pass `as` (or a non-strippable `as` value),
 *  - none of the prop names in `nonStrippableProps` are present,
 *  - every style prop is compile-time literal (classification === 'static').
 *
 * For primitives that synthesize style props at runtime (Stack's
 * `display: 'flex'`, HStack's `flexDirection: 'row'`, etc.), the synthesized
 * values are folded into the extracted static set so the resulting
 * inline-style matches what the wrapper would have rendered.
 *
 * Primitives that own runtime logic (Pressable's pseudo-state injection,
 * Image's overlay state machine) sit at `strippable: false` until that
 * behaviour is folded into the compiler too.
 */
export interface PrimitiveInfo {
  /** Default lowercase HTML tag this primitive renders as. */
  readonly defaultTag: string;
  /** Style props the primitive applies internally; user values win. */
  readonly synthesizedStyleProps: Readonly<Record<string, string | number>>;
  /**
   * Non-style attribute names that the primitive consumes and renames to
   * a style prop (e.g. Stack's `direction` → `flexDirection`). The
   * `defaultValue`, when present, is applied as a synthesized static prop
   * if the user didn't pass the alias.
   */
  readonly aliasedStyleProps: Readonly<
    Record<string, { readonly mapsTo: string; readonly defaultValue?: string | number }>
  >;
  /**
   * Source attribute names whose presence (with any value) forces the
   * wrapper to stay in place. Used by Pressable to gate stripping on
   * pseudo-state and click-handling props that the runtime owns.
   */
  readonly nonStrippableProps: ReadonlySet<string>;
  /**
   * True when the wrapper can ever be stripped at all. False for
   * primitives whose runtime logic isn't yet replicated in the compiler.
   */
  readonly strippable: boolean;
}

export const PRIMITIVE_INFO: Readonly<Record<string, PrimitiveInfo>> = {
  Box: {
    defaultTag: 'div',
    synthesizedStyleProps: {},
    aliasedStyleProps: {},
    nonStrippableProps: new Set(),
    strippable: true,
  },
  Text: {
    defaultTag: 'span',
    synthesizedStyleProps: {},
    aliasedStyleProps: {},
    nonStrippableProps: new Set(),
    strippable: true,
  },
  Stack: {
    defaultTag: 'div',
    synthesizedStyleProps: { display: 'flex' },
    aliasedStyleProps: {
      direction: { mapsTo: 'flexDirection', defaultValue: 'column' },
    },
    nonStrippableProps: new Set(),
    strippable: true,
  },
  HStack: {
    defaultTag: 'div',
    synthesizedStyleProps: { display: 'flex', flexDirection: 'row' },
    aliasedStyleProps: {},
    nonStrippableProps: new Set(),
    strippable: true,
  },
  VStack: {
    defaultTag: 'div',
    synthesizedStyleProps: { display: 'flex', flexDirection: 'column' },
    aliasedStyleProps: {},
    nonStrippableProps: new Set(),
    strippable: true,
  },
  Pressable: {
    defaultTag: 'button',
    synthesizedStyleProps: {},
    aliasedStyleProps: {},
    // Pseudo-state extraction (compiler-core) and onPress/disabled rewrite
    // are both follow-ups; until those land Pressable can never be stripped.
    nonStrippableProps: new Set([
      '_hover',
      '_focus',
      '_active',
      '_disabled',
      'onPress',
      'disabled',
    ]),
    strippable: false,
  },
  Image: {
    defaultTag: 'img',
    synthesizedStyleProps: {},
    aliasedStyleProps: {},
    // Image owns load/error state and an overlay tree — not strippable.
    nonStrippableProps: new Set(),
    strippable: false,
  },
};

export function getPrimitiveInfo(importedName: string): PrimitiveInfo | undefined {
  return PRIMITIVE_INFO[importedName];
}
