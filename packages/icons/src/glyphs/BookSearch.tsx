import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function BookSearch(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M11 22H5.5a1 1 0 0 1 0-5h4.501" />
          <Path d="m21 22-1.879-1.878" />
          <Path d="M3 19.5v-15A2.5 2.5 0 0 1 5.5 2H18a1 1 0 0 1 1 1v8" />
          <Circle cx="17" cy="18" r="3" />
        </>
      )}
    />
  );
}
