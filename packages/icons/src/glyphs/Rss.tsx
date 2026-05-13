import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Rss(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M4 11a9 9 0 0 1 9 9" />
          <Path d="M4 4a16 16 0 0 1 16 16" />
          <Circle cx="5" cy="19" r="1" />
        </>
      )}
    />
  );
}
