import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ListRestart(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21 5H3" />
          <Path d="M7 12H3" />
          <Path d="M7 19H3" />
          <Path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" />
          <Path d="M11 10v4h4" />
        </>
      )}
    />
  );
}
