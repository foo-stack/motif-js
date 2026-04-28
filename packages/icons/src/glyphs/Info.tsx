import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Info(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Line }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Line x1="12" y1="16" x2="12" y2="12" />
          <Line x1="12" y1="8" x2="12.01" y2="8" />
        </>
      )}
    />
  );
}
