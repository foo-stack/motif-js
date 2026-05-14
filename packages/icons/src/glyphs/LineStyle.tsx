import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function LineStyle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11 5h2" />
          <Path d="M15 12h6" />
          <Path d="M19 5h2" />
          <Path d="M3 12h6" />
          <Path d="M3 19h18" />
          <Path d="M3 5h2" />
        </>
      )}
    />
  );
}
