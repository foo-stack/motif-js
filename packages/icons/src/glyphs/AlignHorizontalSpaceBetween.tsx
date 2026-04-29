import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlignHorizontalSpaceBetween(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="6" height="14" x="3" y="5" rx="2" />
          <Rect width="6" height="10" x="15" y="7" rx="2" />
          <Path d="M3 2v20" />
          <Path d="M21 2v20" />
        </>
      )}
    />
  );
}
