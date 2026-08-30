/**
 * Type-level tests. There is nothing to execute here, so this file is not a
 * Vitest suite: the package globs `src/**\/*.test.ts`, which `.test-d.ts` does
 * not match. `yarn typecheck` is the gate, because a failed `expectTypeOf`
 * surfaces as a `tsc` error and every package's tsconfig includes `src/**\/*`.
 */
import { expectTypeOf } from 'vitest';
import { createTheme } from './createTheme.js';
import type {
  KnownScaleName,
  MotifCustomTheme,
  MotifTokens,
  Paths,
  ScalePath,
  TokensOf,
} from './token-path.js';
import type { Theme, TokenScale } from './types.js';

const theme = createTheme({
  name: 'test',
  tokens: {
    colors: { brand: { 500: '#3b82f6' } },
    space: { 4: 16 },
  },
} as const);

// The repair. Before the `Omit`, `Theme`'s own `tokens: TokenMap` intersected
// the literal and `TokenScale`'s index signature collapsed this to `string`.
expectTypeOf<Paths<(typeof theme)['tokens']['colors']>>().toEqualTypeOf<'brand.500'>();
expectTypeOf<Paths<(typeof theme)['tokens']['space']>>().toEqualTypeOf<'4'>();

// Backwards compatibility: the result must still satisfy `Theme`, since
// consumers and `<ThemeProvider themes={[...]}>` are typed against it.
expectTypeOf(theme).toExtend<Theme>();

// ─────────── Paths ───────────────────────────────────────────────

// Nested objects recurse; scalar leaves terminate.
expectTypeOf<Paths<{ brand: { 500: '#3b82f6' }; fg: '#000' }>>().toEqualTypeOf<
  'brand.500' | 'fg'
>();

// Numeric keys survive as their string form, which is what a `$` reference
// actually spells.
expectTypeOf<Paths<{ 4: 16; 8: 32 }>>().toEqualTypeOf<'4' | '8'>();

// A token whose value is itself a `$` reference is a leaf, not a path into
// whatever it points at. `TokenRef` is a string.
expectTypeOf<Paths<{ primary: '$colors.brand.500' }>>().toEqualTypeOf<'primary'>();

// An empty scale contributes nothing.
expectTypeOf<Paths<{}>>().toEqualTypeOf<never>();

// The reason a declared interface cannot be the source: `TokenScale`'s
// `[key: string]` index signature collapses the union to `string`. This is
// why derivation has to run against `typeof theme`, not against `TokenMap`.
expectTypeOf<Paths<TokenScale>>().toEqualTypeOf<string>();

// ─────────── ScalePath ───────────────────────────────────────────

type Tokens = (typeof theme)['tokens'];

// Scoped to one scale: `space` offers its own paths and nothing else.
expectTypeOf<ScalePath<Tokens, 'space'>>().toEqualTypeOf<'$space.4'>();
expectTypeOf<ScalePath<Tokens, 'colors'>>().toEqualTypeOf<'$colors.brand.500'>();

// The per-scale contract, stated as a test: a colour path is not a member of
// the space scale's union. If these ever merge into one global union, this
// fails, and the 8x type-check cost comes back with it.
expectTypeOf<'$colors.brand.500'>().not.toExtend<ScalePath<Tokens, 'space'>>();

// A custom scale outside `KnownScaleName` still derives, since `TokenMap`
// permits user-defined scales.
const custom = createTheme({
  name: 'custom',
  tokens: { colors: { fg: '#000' }, elevation: { low: '0 1px 2px' } },
} as const);
expectTypeOf<ScalePath<(typeof custom)['tokens'], 'elevation'>>().toEqualTypeOf<'$elevation.low'>();

// `animations` is not a derivable scale. It holds object leaves and resolves
// through `resolveAnimationToken`, so dotted paths into it would describe a
// lookup the resolver never performs.
expectTypeOf<'animations'>().not.toExtend<KnownScaleName>();
expectTypeOf<'colors'>().toExtend<KnownScaleName>();

// ─────────── the augmentation channel ────────────────────────────

// Core itself ships unaugmented, and that is the state every consumer who
// never writes a `declare module` block stays in. The empty map is what
// keeps every style prop at its pre-existing `string | number`.
expectTypeOf<MotifTokens>().toEqualTypeOf<Record<never, never>>();
expectTypeOf<keyof MotifTokens>().toEqualTypeOf<never>();
expectTypeOf<MotifCustomTheme>().toEqualTypeOf<Record<never, never>>();

// The resolution rule, checked without augmenting: a module augmentation
// applies to the whole compilation, so asserting the augmented and the
// unaugmented outcome in one program is not possible. `TokensOf` is the rule
// `MotifTokens` applies, so checking it directly covers the augmented branch.
// The real `declare module` path is proven against the built packages by
// `yarn tokens:check`.
expectTypeOf<TokensOf<typeof theme>>().toEqualTypeOf<(typeof theme)['tokens']>();
expectTypeOf<TokensOf<Record<never, never>>>().toEqualTypeOf<Record<never, never>>();

// End to end: a theme goes in, that theme's per-scale paths come out.
expectTypeOf<ScalePath<TokensOf<typeof theme>, 'space'>>().toEqualTypeOf<'$space.4'>();
