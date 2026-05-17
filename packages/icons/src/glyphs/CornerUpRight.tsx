import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CornerUpRight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m15 14 5-5-5-5" />
          <Path d="M4 20v-7a4 4 0 0 1 4-4h12" />
        </>
      )}
    />
  );
}
