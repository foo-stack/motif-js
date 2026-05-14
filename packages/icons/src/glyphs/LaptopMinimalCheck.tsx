import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function LaptopMinimalCheck(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M2 20h20" />
          <Path d="m9 10 2 2 4-4" />
          <Rect x="3" y="4" width="18" height="12" rx="2" />
        </>
      )}
    />
  );
}
