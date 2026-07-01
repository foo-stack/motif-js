import type { StyledConfig } from 'usemotif';

/**
 * Badge recipe — a small status pill. `intent × size`.
 *
 * ```tsx
 * const Badge = styled(Box, badgeRecipe);
 * <Badge intent="success">Active</Badge>;
 * ```
 */
export const badgeRecipe = {
  base: {
    // `inline-flex` + `whiteSpace` are authored for web (an inline pill that
    // never wraps). On React Native the style sanitizer normalizes
    // `inline-flex` → `flex` and strips `whiteSpace`, so this recipe is safe
    // cross-platform — same web-authored-with-native-fallback pattern as
    // `card.ts`'s `boxShadow`.
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '$space.1',
    fontWeight: '$fontWeights.medium',
    borderRadius: '$radii.full',
    whiteSpace: 'nowrap',
  },
  variants: {
    intent: {
      neutral: { bg: '$colors.surface.sunken', color: '$colors.text.muted' },
      primary: { bg: '$colors.action.primary.bg', color: '$colors.action.primary.fg' },
      danger: { bg: '$colors.action.danger.bg', color: '$colors.action.danger.fg' },
      success: { bg: '$colors.action.success.bg', color: '$colors.action.success.fg' },
    },
    size: {
      sm: { paddingInline: '$space.2', py: 1, fontSize: '$fontSizes.xs' },
      md: { paddingInline: '$space.3', py: 2, fontSize: '$fontSizes.sm' },
    },
  },
  defaultVariants: { intent: 'neutral', size: 'sm' },
} as const satisfies StyledConfig;
