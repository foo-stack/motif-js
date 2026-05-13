import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TramFront(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="16" height="16" x="4" y="3" rx="2" />
          <Path d="M4 11h16" />
          <Path d="M12 3v8" />
          <Path d="m8 19-2 3" />
          <Path d="m18 22-2-3" />
          <Path d="M8 15h.01" />
          <Path d="M16 15h.01" />
        </>
      )}
    />
  );
}
