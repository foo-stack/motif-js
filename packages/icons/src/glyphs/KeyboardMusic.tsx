import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function KeyboardMusic(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="20" height="16" x="2" y="4" rx="2" />
          <Path d="M6 8h4" />
          <Path d="M14 8h.01" />
          <Path d="M18 8h.01" />
          <Path d="M2 12h20" />
          <Path d="M6 12v4" />
          <Path d="M10 12v4" />
          <Path d="M14 12v4" />
          <Path d="M18 12v4" />
        </>
      )}
    />
  );
}
