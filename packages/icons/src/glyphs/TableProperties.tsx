import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TableProperties(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M15 3v18" />
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="M21 9H3" />
          <Path d="M21 15H3" />
        </>
      )}
    />
  );
}
