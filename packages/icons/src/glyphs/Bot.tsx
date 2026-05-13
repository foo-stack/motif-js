import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Bot(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M12 8V4H8" />
          <Rect width="16" height="12" x="4" y="8" rx="2" />
          <Path d="M2 14h2" />
          <Path d="M20 14h2" />
          <Path d="M15 13v2" />
          <Path d="M9 13v2" />
        </>
      )}
    />
  );
}
