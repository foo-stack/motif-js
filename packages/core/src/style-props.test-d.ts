/**
 * Type-level tests for the per-prop value rule. Not a Vitest suite: the
 * package globs `src/**\/*.test.ts`, which `.test-d.ts` does not match, so
 * `yarn typecheck` is the gate.
 *
 * Core's own program is necessarily unaugmented, because a module
 * augmentation applies to a whole compilation. These assertions therefore
 * check `StylePropValueFrom` against explicit token maps, which is the rule
 * `StyleProps` applies to whichever map the consumer augmented in. The
 * end-to-end path through a real `declare module` is proven separately by
 * `yarn tokens:check`.
 */
import { expectTypeOf } from 'vitest';
import { createTheme } from './createTheme.js';
import type {
  FontVariationAxisSettings,
  ScaleValueFrom,
  StyleProps,
  StylePropValueFrom,
} from './style-props.js';

const theme = createTheme({
  name: 'test',
  tokens: {
    colors: { brand: { 500: '#3b82f6' } },
    space: { 4: 16, 8: 32 },
  },
} as const);
type Tokens = (typeof theme)['tokens'];

// ─────────── a prop offers its own scale, and only its own ───────

// `p` names the `space` scale, so the space paths are assignable...
expectTypeOf<'$space.4'>().toExtend<StylePropValueFrom<Tokens, 'p'>>();
expectTypeOf<'$space.8'>().toExtend<StylePropValueFrom<Tokens, 'p'>>();

// ...and `backgroundColor` names `colors`, so the colour path lands there.
expectTypeOf<'$colors.brand.500'>().toExtend<StylePropValueFrom<Tokens, 'backgroundColor'>>();

// The union really is per scale. `(string & {})` keeps every string
// assignable, so membership is the assertion that can distinguish the two:
// a colour path must not be a member of the space prop's token arm.
type SpaceTokenArm = Extract<StylePropValueFrom<Tokens, 'p'>, `$${string}`>;
expectTypeOf<SpaceTokenArm>().toEqualTypeOf<'$space.4' | '$space.8'>();
expectTypeOf<
  Extract<StylePropValueFrom<Tokens, 'backgroundColor'>, `$${string}`>
>().toEqualTypeOf<'$colors.brand.500'>();

// ─────────── permissive on purpose ───────────────────────────────

// Raw CSS values still compile. This is what makes the change non-breaking.
expectTypeOf<'12px'>().toExtend<StylePropValueFrom<Tokens, 'p'>>();
expectTypeOf<12>().toExtend<StylePropValueFrom<Tokens, 'p'>>();

// So does a path the scale does not contain. Rejecting it is a separate,
// opt-in mode; conflating the two is what this deliberately avoids.
expectTypeOf<'$nope'>().toExtend<StylePropValueFrom<Tokens, 'p'>>();
expectTypeOf<'$space.999'>().toExtend<StylePropValueFrom<Tokens, 'p'>>();

// ─────────── props without a scale are untouched ─────────────────

// `position` carries no `scale` entry, so it keeps exactly its old type.
expectTypeOf<StylePropValueFrom<Tokens, 'position'>>().toEqualTypeOf<string | number>();
expectTypeOf<StylePropValueFrom<Tokens, 'flexDirection'>>().toEqualTypeOf<string | number>();

// `fontVariationSettings` keeps its typed object form and gains no token arm.
expectTypeOf<StylePropValueFrom<Tokens, 'fontVariationSettings'>>().toEqualTypeOf<
  string | FontVariationAxisSettings
>();
expectTypeOf<{ wght: 600 }>().toExtend<StylePropValueFrom<Tokens, 'fontVariationSettings'>>();

// ─────────── a theme missing a scale ─────────────────────────────

// A consumer may augment with a theme that has no `colors` while
// `backgroundColor` still names that scale. The prop must stay usable, so it
// falls back to `string | number` rather than resolving to `never`.
const spaceOnly = createTheme({ name: 'space-only', tokens: { space: { 4: 16 } } } as const);
type SpaceOnly = (typeof spaceOnly)['tokens'];

expectTypeOf<StylePropValueFrom<SpaceOnly, 'backgroundColor'>>().toEqualTypeOf<string | number>();
expectTypeOf<'#fff'>().toExtend<StylePropValueFrom<SpaceOnly, 'backgroundColor'>>();
expectTypeOf<StylePropValueFrom<SpaceOnly, 'backgroundColor'>>().not.toEqualTypeOf<never>();

// The scale it does define still derives.
expectTypeOf<'$space.4'>().toExtend<StylePropValueFrom<SpaceOnly, 'p'>>();

// The same fallback covers the empty map, which is what every unaugmented
// consumer gets.
expectTypeOf<ScaleValueFrom<Record<never, never>, 'space'>>().toEqualTypeOf<string | number>();

// ─────────── unaugmented is exactly today's behaviour ────────────

// Core ships unaugmented, so the live `StyleProps` must be unchanged. This is
// the assertion that keeps the change a minor rather than a major.
expectTypeOf<NonNullable<StyleProps['p']>>().toEqualTypeOf<string | number>();
expectTypeOf<NonNullable<StyleProps['backgroundColor']>>().toEqualTypeOf<string | number>();
expectTypeOf<NonNullable<StyleProps['fontVariationSettings']>>().toEqualTypeOf<
  string | FontVariationAxisSettings
>();
