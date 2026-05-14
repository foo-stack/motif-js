import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function SquareRadical(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M7 12h2l2 5 2-10h4" />
          <Rect x="3" y="3" width="18" height="18" rx="2" />
        </>
      )}
    />
  );
}
