import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Rows4(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M21 7.5H3" />
          <Path d="M21 12H3" />
          <Path d="M21 16.5H3" />
        </>
      )}
    />
  );
}
