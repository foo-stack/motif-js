import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function SmartphoneNfc(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="7" height="12" x="2" y="6" rx="1" />
          <Path d="M13 8.32a7.43 7.43 0 0 1 0 7.36" />
          <Path d="M16.46 6.21a11.76 11.76 0 0 1 0 11.58" />
          <Path d="M19.91 4.1a15.91 15.91 0 0 1 .01 15.8" />
        </>
      )}
    />
  );
}
