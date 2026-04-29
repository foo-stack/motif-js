import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Cone(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Ellipse, Path }) => (
        <>
          <Path d="m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98" />
          <Ellipse cx="12" cy="19" rx="9" ry="3" />
        </>
      )}
    />
  );
}
