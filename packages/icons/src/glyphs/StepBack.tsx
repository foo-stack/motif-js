import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function StepBack(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z" />
          <Path d="M21 20V4" />
        </>
      )}
    />
  );
}
