import type { StyledConfig } from 'usemotif';

/**
 * Text-input recipe — `size`, with an `invalid` boolean variant for form
 * validation.
 *
 * ```tsx
 * import { styled, Input } from 'usemotif';
 * const TextField = styled(Input, inputRecipe);
 * <TextField size="md" invalid={hasError} />;
 * ```
 *
 * The focus ring is interaction, so it isn't baked into the recipe (styled()
 * variants are static). Add it at the call site:
 *
 * ```tsx
 * <TextField _focus={{ borderColor: '$colors.action.primary.bg' }}
 *            transition="border-color 150ms ease" />
 * ```
 */
export const inputRecipe = {
  base: {
    display: 'flex',
    width: '100%',
    bg: '$colors.surface.base',
    color: '$colors.text.default',
    borderRadius: '$radii.md',
    borderWidth: '$borderWidths.thin',
    borderColor: '$colors.border.default',
  },
  variants: {
    size: {
      sm: { height: 32, paddingInline: '$space.2', fontSize: '$fontSizes.sm' },
      md: { height: 40, paddingInline: '$space.3', fontSize: '$fontSizes.md' },
      lg: { height: 48, paddingInline: '$space.4', fontSize: '$fontSizes.lg' },
    },
    invalid: {
      true: { borderColor: '$colors.action.danger.bg' },
    },
  },
  defaultVariants: { size: 'md' },
} as const satisfies StyledConfig;
