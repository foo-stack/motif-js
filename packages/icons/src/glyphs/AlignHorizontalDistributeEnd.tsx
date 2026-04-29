import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlignHorizontalDistributeEnd(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="6" height="14" x="4" y="5" rx="2" />
          <Rect width="6" height="10" x="14" y="7" rx="2" />
          <Path d="M10 2v20" />
          <Path d="M20 2v20" />
        </>
      )}
    />
  );
}
