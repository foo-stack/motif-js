import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BoxSelect(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M5 3a2 2 0 0 0-2 2" />
          <Path d="M19 3a2 2 0 0 1 2 2" />
          <Path d="M21 19a2 2 0 0 1-2 2" />
          <Path d="M5 21a2 2 0 0 1-2-2" />
          <Path d="M9 3h1" />
          <Path d="M9 21h1" />
          <Path d="M14 3h1" />
          <Path d="M14 21h1" />
          <Path d="M3 9v1" />
          <Path d="M21 9v1" />
          <Path d="M3 14v1" />
          <Path d="M21 14v1" />
        </>
      )}
    />
  );
}
