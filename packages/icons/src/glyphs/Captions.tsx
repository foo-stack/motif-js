import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Captions(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
          <Path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
        </>
      )}
    />
  );
}
