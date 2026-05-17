import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Timer(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line }) => (
        <>
          <Line x1="10" x2="14" y1="2" y2="2" />
          <Line x1="12" x2="15" y1="14" y2="11" />
          <Circle cx="12" cy="14" r="8" />
        </>
      )}
    />
  );
}
