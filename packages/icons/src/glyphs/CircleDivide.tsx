import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CircleDivide(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Line x1="8" x2="16" y1="12" y2="12" />
          <Line x1="12" x2="12" y1="16" y2="16" />
          <Line x1="12" x2="12" y1="8" y2="8" />
        </>
      )}
    />
  );
}
