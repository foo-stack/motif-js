import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TimerReset(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 2h4" />
          <Path d="M12 14v-4" />
          <Path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" />
          <Path d="M9 17H4v5" />
        </>
      )}
    />
  );
}
