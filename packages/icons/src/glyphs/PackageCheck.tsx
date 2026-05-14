import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function PackageCheck(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 22V12" />
          <Path d="m16 17 2 2 4-4" />
          <Path d="M21 11.127V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.32-.753" />
          <Path d="M3.29 7 12 12l8.71-5" />
          <Path d="m7.5 4.27 8.997 5.148" />
        </>
      )}
    />
  );
}
