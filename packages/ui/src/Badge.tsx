import { badgeRecipe } from '@usemotif/recipes';
import { Box, styled } from 'usemotif';

/**
 * Themed status pill. `intent` (`neutral` · `primary` · `danger` · `success`)
 * × `size` (`sm` · `md`).
 *
 * ```tsx
 * <Badge intent="success">Active</Badge>
 * ```
 */
export const Badge = styled(Box, badgeRecipe);
