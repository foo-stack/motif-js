import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlignHorizontalJustifyEnd(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="6" height="14" x="2" y="5" rx="2" />
          <Rect width="6" height="10" x="12" y="7" rx="2" />
          <Path d="M22 2v20" />
        </>
      )}
    />
  );
}
