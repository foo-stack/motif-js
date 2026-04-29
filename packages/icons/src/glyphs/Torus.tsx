import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Torus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Ellipse }) => (
        <>
          <Ellipse cx="12" cy="11" rx="3" ry="2" />
          <Ellipse cx="12" cy="12.5" rx="10" ry="8.5" />
        </>
      )}
    />
  );
}
