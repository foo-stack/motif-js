import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FlashlightOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11.652 6H18" />
          <Path d="M12 13v1" />
          <Path d="M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8a4 4 0 0 0-.8-2.4l-.6-.8A3 3 0 0 1 6 7V6" />
          <Path d="m2 2 20 20" />
          <Path d="M7.649 2H17a1 1 0 0 1 1 1v4a3 3 0 0 1-.6 1.8l-.6.8a4 4 0 0 0-.55 1.007" />
        </>
      )}
    />
  );
}
