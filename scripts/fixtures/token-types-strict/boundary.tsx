import { Box, styled } from 'usemotif';
import './augmentation.js';

/**
 * What strict mode does and does not reach. Each `@ts-expect-error` here is a
 * claim that the case IS covered; a case with no directive is one that is
 * deliberately not.
 */

// Flat props on a primitive: covered.
// @ts-expect-error
export const flat = <Box p="$nope" />;

// Pseudo-state bag: nested object, so the mapped type does not descend.
export const pseudo = <Box _hover={{ p: '$nope' }} />;

// Responsive object: same reason.
export const responsive = <Box p={{ base: '$nope' }} />;

// A styled() config bag is a plain argument, not a validated prop.
const Card = styled('div', { base: { p: '$nope' } });
export const card = <Card />;
