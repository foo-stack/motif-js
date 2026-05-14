import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ToyBrick(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="12" x="3" y="8" rx="1" />
          <Path d="M10 8V5c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v3" />
          <Path d="M19 8V5c0-.6-.4-1-1-1h-3a1 1 0 0 0-1 1v3" />
        </>
      )}
    />
  );
}
