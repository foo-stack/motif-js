import { Box } from 'usemotif';
import './augmentation.js';

declare const dynamic: string;
declare const dynamicNumber: number;

/** Everything here must keep compiling with the flag on. */
export const accepted = (
  <>
    <Box p="$space.4" />
    <Box backgroundColor="$colors.brand.500" />
    <Box p="12px" />
    <Box p={12} />
    <Box p="clamp(1rem, 2vw, 2rem)" />
    <Box p={dynamic} />
    <Box p={dynamicNumber} />
    <Box fontFamily="日本語フォント" />
    <Box position="absolute" />
  </>
);

/** Each of these must be an error, or the `@ts-expect-error` above it fails. */
export const rejected = (
  <>
    {/* @ts-expect-error a path the space scale does not contain */}
    <Box p="$space.999" />
    {/* @ts-expect-error not a token path at all */}
    <Box p="$nope" />
    {/* @ts-expect-error a real path, but from the wrong scale for this prop */}
    <Box p="$colors.brand.500" />
  </>
);

import { Stack } from 'usemotif';

/** A component typed at the barrel rather than at its definition. */
export const barrel = (
  <>
    <Stack p="$space.4" />
    <Stack p="12px" />
    {/* @ts-expect-error strict mode must reach a barrel-typed component too */}
    <Stack p="$nope" />
  </>
);

import { styled } from 'usemotif';

const Card = styled('div', {
  base: { p: '$space.4', backgroundColor: '$colors.brand.500' },
  variants: { tone: { loud: { p: '$space.8' } } },
});

/** A `styled()` result is validated the same way a primitive is. */
export const styledUse = (
  <>
    <Card p="$space.4" />
    <Card p="12px" />
    {/* @ts-expect-error strict mode must reach a styled() result */}
    <Card p="$nope" />
  </>
);
