import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Grid3x2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M15 3v18" />
          <Path d="M3 12h18" />
          <Path d="M9 3v18" />
          <Rect x="3" y="3" width="18" height="18" rx="2" />
        </>
      )}
    />
  );
}
