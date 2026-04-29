import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ListVideo(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21 5H3" />
          <Path d="M10 12H3" />
          <Path d="M10 19H3" />
          <Path d="M15 12.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z" />
        </>
      )}
    />
  );
}
