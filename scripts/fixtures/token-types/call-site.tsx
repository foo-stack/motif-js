import { Box } from 'usemotif';
import './augmentation.js';

/**
 * The un-opted-in half of the contract, checked at a real call site rather
 * than through a type alias. `ValidateStyleProps` only runs on a component's
 * props, so a bad path has to be written as JSX for the default state to be
 * proven at all.
 *
 * Every one of these must compile. If strict mode ever becomes the default,
 * the last three stop compiling and `tokens:check` fails.
 */
export const permissive = (
  <>
    <Box p="$space.4" />
    <Box p="12px" />
    <Box p="$nope" />
    <Box p="$space.999" />
    <Box backgroundColor="$space.4" />
  </>
);
