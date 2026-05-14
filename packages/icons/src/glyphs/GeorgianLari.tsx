import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function GeorgianLari(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11.5 21a7.5 7.5 0 1 1 7.35-9" />
          <Path d="M13 12V3" />
          <Path d="M4 21h16" />
          <Path d="M9 12V3" />
        </>
      )}
    />
  );
}
