import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function RemoveFormatting(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 7V4h16v3" />
          <Path d="M5 20h6" />
          <Path d="M13 4 8 20" />
          <Path d="m15 15 5 5" />
          <Path d="m20 15-5 5" />
        </>
      )}
    />
  );
}
