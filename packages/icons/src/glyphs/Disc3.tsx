import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Disc3(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M6 12c0-1.7.7-3.2 1.8-4.2" />
          <Circle cx="12" cy="12" r="2" />
          <Path d="M18 12c0 1.7-.7 3.2-1.8 4.2" />
        </>
      )}
    />
  );
}
