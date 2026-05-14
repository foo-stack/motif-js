import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Videotape(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Rect width="20" height="16" x="2" y="4" rx="2" />
          <Path d="M2 8h20" />
          <Circle cx="8" cy="14" r="2" />
          <Path d="M8 12h8" />
          <Circle cx="16" cy="14" r="2" />
        </>
      )}
    />
  );
}
