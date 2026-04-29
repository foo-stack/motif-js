import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CloudUpload(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 13v8" />
          <Path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <Path d="m8 17 4-4 4 4" />
        </>
      )}
    />
  );
}
