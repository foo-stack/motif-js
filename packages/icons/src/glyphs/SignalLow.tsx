import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SignalLow(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2 20h.01" />
          <Path d="M7 20v-4" />
        </>
      )}
    />
  );
}
