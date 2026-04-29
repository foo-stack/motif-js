import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ImageUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" />
          <Path d="m14 19.5 3-3 3 3" />
          <Path d="M17 22v-5.5" />
          <Circle cx="9" cy="9" r="2" />
        </>
      )}
    />
  );
}
