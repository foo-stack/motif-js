import type { ReactElement, ReactNode } from 'react';
import { Box } from './Box.js';

/**
 * Native Svg primitive — placeholder shell for inline SVG content.
 *
 * RN doesn't ship native SVG support; the canonical integration is
 * `react-native-svg`. To keep `@motif-js/react-native` dep-light in
 * v0, this primitive renders a styled Box whose children should be
 * RN-SVG elements. Pass `SvgComponent={SVG}` (where `SVG` is from
 * `react-native-svg`) to take over the actual render.
 *
 * The shape mirrors the web Svg's prop surface so cross-platform
 * code stays portable: same `size` semantic, same `viewBox` /
 * `fill` / `stroke` defaults documented for the host integration.
 */
export interface SvgProps {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  viewBox?: string;
  fill?: string;
  stroke?: string;
  /**
   * The actual SVG component. Pass `Svg` from `react-native-svg`
   * here (or any compatible host component). Without it, the
   * primitive renders a sized Box with the children as-is — useful
   * for testing or text-fallback icons.
   */
  SvgComponent?: React.ComponentType<Record<string, unknown>>;
  children?: ReactNode;
}
export function Svg({
  size = 16,
  width,
  height,
  viewBox = '0 0 24 24',
  fill = 'none',
  stroke = 'currentColor',
  SvgComponent,
  children,
}: SvgProps): ReactElement {
  const w = width ?? size;
  const h = height ?? size;
  if (SvgComponent !== undefined) {
    return (
      <SvgComponent width={w} height={h} viewBox={viewBox} fill={fill} stroke={stroke}>
        {children}
      </SvgComponent>
    );
  }
  return (
    <Box
      style={{
        width: typeof w === 'number' ? w : undefined,
        height: typeof h === 'number' ? h : undefined,
      }}
    >
      {children}
    </Box>
  );
}
