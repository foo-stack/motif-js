import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Camera(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Circle }) => (
        <>
          <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <Circle cx="12" cy="13" r="4" />
        </>
      )}
    />
  );
}
