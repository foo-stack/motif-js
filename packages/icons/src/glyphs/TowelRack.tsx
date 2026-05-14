import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TowelRack(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M22 7h-2" />
          <Path d="M6.5 3h11A2.5 2.5 0 0 1 20 5.5V20a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V5.5a1 1 0 0 0-5 0V17a1 1 0 0 0 1 1h4" />
          <Path d="M9 7H2" />
        </>
      )}
    />
  );
}
