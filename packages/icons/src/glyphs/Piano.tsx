import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Piano(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8" />
          <Path d="M2 14h20" />
          <Path d="M6 14v4" />
          <Path d="M10 14v4" />
          <Path d="M14 14v4" />
          <Path d="M18 14v4" />
        </>
      )}
    />
  );
}
