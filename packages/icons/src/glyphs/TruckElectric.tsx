import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TruckElectric(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M14 19V7a2 2 0 0 0-2-2H9" />
          <Path d="M15 19H9" />
          <Path d="M19 19h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18.3 9.38a1 1 0 0 0-.78-.38H14" />
          <Path d="M2 13v5a1 1 0 0 0 1 1h2" />
          <Path d="M4 3 2.15 5.15a.495.495 0 0 0 .35.86h2.15a.47.47 0 0 1 .35.86L3 9.02" />
          <Circle cx="17" cy="19" r="2" />
          <Circle cx="7" cy="19" r="2" />
        </>
      )}
    />
  );
}
