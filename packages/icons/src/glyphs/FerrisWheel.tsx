import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FerrisWheel(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="2" />
          <Path d="M12 2v4" />
          <Path d="m6.8 15-3.5 2" />
          <Path d="m20.7 7-3.5 2" />
          <Path d="M6.8 9 3.3 7" />
          <Path d="m20.7 17-3.5-2" />
          <Path d="m9 22 3-8 3 8" />
          <Path d="M8 22h8" />
          <Path d="M18 18.7a9 9 0 1 0-12 0" />
        </>
      )}
    />
  );
}
