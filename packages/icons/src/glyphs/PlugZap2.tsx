import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function PlugZap2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" />
          <Path d="m2 22 3-3" />
          <Path d="M7.5 13.5 10 11" />
          <Path d="M10.5 16.5 13 14" />
          <Path d="m18 3-4 4h6l-4 4" />
        </>
      )}
    />
  );
}
