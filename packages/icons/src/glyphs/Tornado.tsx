import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Tornado(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21 4H3" />
          <Path d="M18 8H6" />
          <Path d="M19 12H9" />
          <Path d="M16 16h-6" />
          <Path d="M11 20H9" />
        </>
      )}
    />
  );
}
