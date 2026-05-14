import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TestTube(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2" />
          <Path d="M8.5 2h7" />
          <Path d="M14.5 16h-5" />
        </>
      )}
    />
  );
}
