import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TestTubes(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M9 2v17.5A2.5 2.5 0 0 1 6.5 22A2.5 2.5 0 0 1 4 19.5V2" />
          <Path d="M20 2v17.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1-2.5-2.5V2" />
          <Path d="M3 2h7" />
          <Path d="M14 2h7" />
          <Path d="M9 16H4" />
          <Path d="M20 16h-5" />
        </>
      )}
    />
  );
}
