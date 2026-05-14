import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function MessageCircleCheck(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
          <Path d="m9 12 2 2 4-4" />
        </>
      )}
    />
  );
}
