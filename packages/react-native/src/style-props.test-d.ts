/**
 * Type-level tests. Not a Vitest suite: the package globs `src/**\/*.test.ts`,
 * so `yarn typecheck` is the gate.
 *
 * These exist to prove that the per-prop value rule lives in
 * `@usemotif/core` and reaches this package's primitives, rather than being
 * restated here. `packages/react` carries the mirror of this file, so
 * a change that covered only one platform would fail on the other.
 */
import type { StyleProps } from '@usemotif/core';
import { expectTypeOf } from 'vitest';
import type { BoxProps } from './Box.js';

// Whatever core resolves a style prop to, `Box` accepts. `Box` widens it with
// responsive and motion-value forms, so this is one-directional by design.
expectTypeOf<NonNullable<StyleProps['p']>>().toExtend<NonNullable<BoxProps['p']>>();
expectTypeOf<NonNullable<StyleProps['backgroundColor']>>().toExtend<
  NonNullable<BoxProps['backgroundColor']>
>();

// Unaugmented, a style prop is `string | number` and nothing else. This is
// the assertion that gates on core: widening the value rule there surfaces
// here without this file changing.
expectTypeOf<'12px'>().toExtend<NonNullable<BoxProps['p']>>();
expectTypeOf<12>().toExtend<NonNullable<BoxProps['p']>>();
expectTypeOf<boolean>().not.toExtend<NonNullable<BoxProps['p']>>();
expectTypeOf<boolean>().not.toExtend<NonNullable<BoxProps['backgroundColor']>>();
