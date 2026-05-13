import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Tv(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m17 2-5 5-5-5" />
          <Rect width="20" height="15" x="2" y="7" rx="2" />
        </>
      )}
    />
  );
}
