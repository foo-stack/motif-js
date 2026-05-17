import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function BugPlay(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 19.655A6 6 0 0 1 6 14v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 3.97" />
          <Path d="M14 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z" />
          <Path d="M14.12 3.88 16 2" />
          <Path d="M21 5a4 4 0 0 1-3.55 3.97" />
          <Path d="M3 21a4 4 0 0 1 3.81-4" />
          <Path d="M3 5a4 4 0 0 0 3.55 3.97" />
          <Path d="M6 13H2" />
          <Path d="m8 2 1.88 1.88" />
          <Path d="M9 7.13V6a3 3 0 1 1 6 0v1.13" />
        </>
      )}
    />
  );
}
