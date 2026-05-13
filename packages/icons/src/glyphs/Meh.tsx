import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Meh(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Line x1="8" x2="16" y1="15" y2="15" />
          <Line x1="9" x2="9.01" y1="9" y2="9" />
          <Line x1="15" x2="15.01" y1="9" y2="9" />
        </>
      )}
    />
  );
}
