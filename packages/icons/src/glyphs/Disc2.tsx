import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Disc2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Circle cx="12" cy="12" r="4" />
          <Path d="M12 12h.01" />
        </>
      )}
    />
  );
}
