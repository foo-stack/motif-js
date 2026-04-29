import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function WeightTilde(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M6.5 8a2 2 0 0 0-1.906 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8z" />
          <Path d="M7.999 15a2.5 2.5 0 0 1 4 0 2.5 2.5 0 0 0 4 0" />
          <Circle cx="12" cy="5" r="3" />
        </>
      )}
    />
  );
}
