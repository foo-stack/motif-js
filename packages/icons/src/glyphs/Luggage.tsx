import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Luggage(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2" />
          <Path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14" />
          <Path d="M10 20h4" />
          <Circle cx="16" cy="20" r="2" />
          <Circle cx="8" cy="20" r="2" />
        </>
      )}
    />
  );
}
