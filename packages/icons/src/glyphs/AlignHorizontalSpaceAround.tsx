import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function AlignHorizontalSpaceAround(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="6" height="10" x="9" y="7" rx="2" />
          <Path d="M4 22V2" />
          <Path d="M20 22V2" />
        </>
      )}
    />
  );
}
