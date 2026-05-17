import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function RulerDimensionLine(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 15v-3" />
          <Path d="M14 15v-3" />
          <Path d="M18 15v-3" />
          <Path d="M2 8V4" />
          <Path d="M22 6H2" />
          <Path d="M22 8V4" />
          <Path d="M6 15v-3" />
          <Rect x="2" y="12" width="20" height="8" rx="2" />
        </>
      )}
    />
  );
}
