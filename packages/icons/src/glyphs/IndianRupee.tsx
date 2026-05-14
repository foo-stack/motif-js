import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function IndianRupee(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M6 3h12" />
          <Path d="M6 8h12" />
          <Path d="m6 13 8.5 8" />
          <Path d="M6 13h3" />
          <Path d="M9 13c6.667 0 6.667-10 0-10" />
        </>
      )}
    />
  );
}
