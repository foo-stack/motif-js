import type { StyledConfig } from 'usemotif';

/**
 * Button recipe — `intent × size` static styling as plain `styled()` data.
 *
 * ```tsx
 * import { styled, Pressable } from 'usemotif';
 * import { buttonRecipe } from '@usemotif/recipes';
 *
 * const Button = styled(Pressable, buttonRecipe);
 * <Button intent="primary" size="lg">Save</Button>;
 * ```
 *
 * Colours resolve against the active theme's semantic `action` / `surface` /
 * `text` tokens, so the same recipe themes itself in light and dark.
 *
 * Interaction (hover, focus ring, press, transition) is intentionally NOT in
 * the recipe: `styled()` variants are static style props. Add them at the call
 * site, where the styled component forwards them to `Box`:
 *
 * ```tsx
 * <Button _hover={{ opacity: 0.92 }} transition="opacity 150ms ease" />
 * ```
 */
export const buttonRecipe = {
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '$space.2',
    fontWeight: '$fontWeights.semibold',
    borderRadius: '$radii.md',
    borderWidth: '$borderWidths.thin',
    borderColor: 'transparent',
  },
  variants: {
    intent: {
      primary: { bg: '$colors.action.primary.bg', color: '$colors.action.primary.fg' },
      danger: { bg: '$colors.action.danger.bg', color: '$colors.action.danger.fg' },
      success: { bg: '$colors.action.success.bg', color: '$colors.action.success.fg' },
      neutral: {
        bg: '$colors.surface.muted',
        color: '$colors.text.default',
        borderColor: '$colors.border.default',
      },
      ghost: { bg: 'transparent', color: '$colors.text.default' },
    },
    size: {
      sm: { height: 32, paddingInline: '$space.3', fontSize: '$fontSizes.sm' },
      md: { height: 40, paddingInline: '$space.4', fontSize: '$fontSizes.md' },
      lg: { height: 48, paddingInline: '$space.6', fontSize: '$fontSizes.lg' },
    },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
} as const satisfies StyledConfig;
