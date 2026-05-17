import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function TextInitial(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M15 5h6" />
          <Path d="M15 12h6" />
          <Path d="M3 19h18" />
          <Path d="m3 12 3.553-7.724a.5.5 0 0 1 .894 0L11 12" />
          <Path d="M3.92 10h6.16" />
        </>
      )}
    />
  );
}
