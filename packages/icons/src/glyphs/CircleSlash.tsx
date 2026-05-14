import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CircleSlash(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Line x1="9" x2="15" y1="15" y2="9" />
        </>
      )}
    />
  );
}
