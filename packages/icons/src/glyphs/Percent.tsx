import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Percent(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line }) => (
        <>
          <Line x1="19" x2="5" y1="5" y2="19" />
          <Circle cx="6.5" cy="6.5" r="2.5" />
          <Circle cx="17.5" cy="17.5" r="2.5" />
        </>
      )}
    />
  );
}
