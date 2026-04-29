import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FileSearch(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
          <Path d="M14 2v5a1 1 0 0 0 1 1h5" />
          <Circle cx="11.5" cy="14.5" r="2.5" />
          <Path d="M13.3 16.3 15 18" />
        </>
      )}
    />
  );
}
