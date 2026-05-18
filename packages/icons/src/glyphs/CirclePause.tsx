import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CirclePause(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Line x1="10" x2="10" y1="15" y2="9" />
          <Line x1="14" x2="14" y1="15" y2="9" />
        </>
      )}
    />
  );
}
