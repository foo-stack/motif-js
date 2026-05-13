import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Mail(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
          <Rect x="2" y="4" width="20" height="16" rx="2" />
        </>
      )}
    />
  );
}
