import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ZodiacVirgo(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11 5.5a1 1 0 0 1 5 0V16a5 5 0 0 0 5 5" />
          <Path d="M16 11.5a1 1 0 0 1 5 0V16a5 5 0 0 1-5 5" />
          <Path d="M6 19V6a3 3 0 0 0-3-3h0" />
          <Path d="M6 5.5a1 1 0 0 1 5 0V19" />
        </>
      )}
    />
  );
}
