import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Forward(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m15 17 5-5-5-5" />
          <Path d="M4 18v-2a4 4 0 0 1 4-4h12" />
        </>
      )}
    />
  );
}
