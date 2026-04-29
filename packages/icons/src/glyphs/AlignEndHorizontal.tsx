import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlignEndHorizontal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="6" height="16" x="4" y="2" rx="2" />
          <Rect width="6" height="9" x="14" y="9" rx="2" />
          <Path d="M22 22H2" />
        </>
      )}
    />
  );
}
