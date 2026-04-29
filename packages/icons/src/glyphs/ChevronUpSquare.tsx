import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronUpSquare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="18" height="18" x="3" y="3" rx="2" />
          <Path d="m8 14 4-4 4 4" />
        </>
      )}
    />
  );
}
