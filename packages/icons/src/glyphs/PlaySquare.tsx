import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PlaySquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect x="3" y="3" width="18" height="18" rx="2" />
          <Path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z" />
        </>
      )}
    />
  );
}
