import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function UtilityPole(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 2v20" />
          <Path d="M2 5h20" />
          <Path d="M3 3v2" />
          <Path d="M7 3v2" />
          <Path d="M17 3v2" />
          <Path d="M21 3v2" />
          <Path d="m19 5-7 7-7-7" />
        </>
      )}
    />
  );
}
