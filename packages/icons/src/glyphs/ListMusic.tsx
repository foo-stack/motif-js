import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ListMusic(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M16 5H3" />
          <Path d="M11 12H3" />
          <Path d="M11 19H3" />
          <Path d="M21 16V5" />
          <Circle cx="18" cy="16" r="3" />
        </>
      )}
    />
  );
}
