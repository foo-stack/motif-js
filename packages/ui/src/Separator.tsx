'use client';

import { Box } from 'usemotif';

export interface SeparatorProps {
  /** Default `horizontal` (a full-width hairline). `vertical` stretches to the
   * parent's height — use inside a flex row. */
  readonly orientation?: 'horizontal' | 'vertical';
}

/**
 * A themed `role="separator"` hairline drawn from the `border.default` token.
 *
 * ```tsx
 * <Separator />
 * <HStack><span>A</span><Separator orientation="vertical" /><span>B</span></HStack>
 * ```
 */
export function Separator({ orientation = 'horizontal' }: SeparatorProps) {
  const vertical = orientation === 'vertical';
  return (
    <Box
      role="separator"
      aria-orientation={orientation}
      bg="$colors.border.default"
      {...(vertical ? { width: 1, alignSelf: 'stretch' } : { height: 1, width: '100%' })}
    />
  );
}
