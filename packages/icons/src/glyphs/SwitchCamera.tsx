import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SwitchCamera(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
          <Path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" />
          <Circle cx="12" cy="12" r="3" />
          <Path d="m18 22-3-3 3-3" />
          <Path d="m6 2 3 3-3 3" />
        </>
      )}
    />
  );
}
