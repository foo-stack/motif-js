import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Divide(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line }) => (
        <>
          <Circle cx="12" cy="6" r="1" />
          <Line x1="5" x2="19" y1="12" y2="12" />
          <Circle cx="12" cy="18" r="1" />
        </>
      )}
    />
  );
}
