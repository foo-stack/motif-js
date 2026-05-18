import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function AirVent(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18 17.5a2.5 2.5 0 1 1-4 2.03V12" />
          <Path d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <Path d="M6 8h12" />
          <Path d="M6.6 15.572A2 2 0 1 0 10 17v-5" />
        </>
      )}
    />
  );
}
