import { cardRecipe } from '@usemotif/recipes';
import { Box, styled } from 'usemotif';

/**
 * Themed surface container. `elevation` (`flat` · `raised`) ×
 * `padding` (`none` · `sm` · `md` · `lg`). Install-and-go - the recipe is
 * already applied, so you don't call `styled()` yourself.
 *
 * ```tsx
 * <Card elevation="raised" padding="lg">...</Card>
 * ```
 */
export const Card = styled(Box, cardRecipe);
