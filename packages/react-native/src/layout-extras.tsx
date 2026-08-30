import type { MotifComponent } from '@usemotif/core';
import type { ReactElement, ReactNode } from 'react';
import { SafeAreaView, type ViewStyle } from 'react-native';
import { Box, type BoxProps } from './Box.js';

/**
 * Z-axis stack — children overlap. RN doesn't have CSS Grid, so we
 * use absolute-positioning for non-first children. The first child
 * establishes the natural size; subsequent children are pinned to
 * the four edges and inherit that size. Source order = paint order
 * (matches React + the web implementation).
 */
export interface ZStackProps extends BoxProps {
  children?: ReactNode;
}
export const ZStack: MotifComponent<ZStackProps, ReactElement | null> = function ({
  children,
  ...rest
}: ZStackProps): ReactElement {
  const arr = (Array.isArray(children) ? children : [children]).filter(
    (c) => c !== null && c !== undefined && c !== false,
  );
  return (
    <Box position="relative" {...rest}>
      {arr.map((c, i) => (
        <Box
          key={i}
          {...(i > 0
            ? ({
                position: 'absolute',
                style: { top: 0, right: 0, bottom: 0, left: 0 } as ViewStyle,
              } as const)
            : {})}
        >
          {c}
        </Box>
      ))}
    </Box>
  );
};

export interface SpacerProps extends BoxProps {}
export const Spacer: MotifComponent<SpacerProps, ReactElement | null> = function (
  props: SpacerProps,
): ReactElement {
  return <Box flex={1} {...props} />;
};

export interface CenterProps extends BoxProps {
  children?: ReactNode;
}
export const Center: MotifComponent<CenterProps, ReactElement | null> = function ({
  children,
  ...rest
}: CenterProps): ReactElement {
  return (
    <Box alignItems="center" justifyContent="center" {...rest}>
      {children}
    </Box>
  );
};

export interface WrapProps extends Omit<BoxProps, 'flexWrap'> {
  children?: ReactNode;
}
export const Wrap: MotifComponent<WrapProps, ReactElement | null> = function ({
  children,
  ...rest
}: WrapProps): ReactElement {
  return (
    <Box flexDirection="row" flexWrap="wrap" {...rest}>
      {children}
    </Box>
  );
};

export interface AspectRatioProps extends BoxProps {
  ratio?: number;
  children?: ReactNode;
}
export const AspectRatio: MotifComponent<AspectRatioProps, ReactElement | null> = function ({
  ratio = 1,
  children,
  ...rest
}: AspectRatioProps): ReactElement {
  return (
    <Box style={{ aspectRatio: ratio }} {...rest}>
      {children}
    </Box>
  );
};

/**
 * Native Grid — RN doesn't ship CSS Grid. We polyfill a uniform-column
 * layout via flex: each child gets `flexBasis: 100/columns + '%'` and
 * the row container uses `flex-wrap: wrap`. Falls back to a simple
 * row when neither `columns` nor `templateColumns` is set.
 *
 * `templateColumns` (raw string) is honoured as a hint when present
 * but in practice the polyfill cannot represent track lists like
 * `'1fr 2fr'`. Callers needing real track flexibility on native
 * should use a custom layout component; this primitive is for the
 * 80% case (uniform column count).
 */
export interface GridProps extends BoxProps {
  columns?: number;
  templateColumns?: string;
  templateRows?: string;
  children?: ReactNode;
}
export const Grid: MotifComponent<GridProps, ReactElement | null> = function ({
  columns,
  children,
  ...rest
}: GridProps): ReactElement {
  const arr = (Array.isArray(children) ? children : [children]).filter(
    (c) => c !== null && c !== undefined && c !== false,
  );
  const basis = columns !== undefined && columns > 0 ? `${100 / columns}%` : undefined;
  return (
    <Box flexDirection="row" flexWrap="wrap" {...rest}>
      {arr.map((c, i) => (
        <Box key={i} {...(basis !== undefined ? { style: { flexBasis: basis } as ViewStyle } : {})}>
          {c}
        </Box>
      ))}
    </Box>
  );
};

export interface FlexProps extends BoxProps {
  direction?: BoxProps['flexDirection'];
  children?: ReactNode;
}
export const Flex: MotifComponent<FlexProps, ReactElement | null> = function ({
  direction,
  children,
  ...rest
}: FlexProps): ReactElement {
  return (
    <Box {...(direction !== undefined ? { flexDirection: direction } : {})} {...rest}>
      {children}
    </Box>
  );
};

/**
 * SafeArea — wraps RN's `SafeAreaView` so children avoid the iOS
 * notch + Android system insets. The styled Box sits inside the
 * SafeAreaView and carries the user's style props. The web
 * equivalent in `@usemotif/react` is a no-op Box; both accept
 * the same props so cross-platform code stays portable.
 */
export interface SafeAreaProps extends BoxProps {
  children?: ReactNode;
}
export const SafeArea: MotifComponent<SafeAreaProps, ReactElement | null> = function ({
  children,
  ...rest
}: SafeAreaProps): ReactElement {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} {...rest}>
        {children}
      </Box>
    </SafeAreaView>
  );
};
