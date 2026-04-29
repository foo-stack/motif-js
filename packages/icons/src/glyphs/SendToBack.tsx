import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SendToBack(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect x="14" y="14" width="8" height="8" rx="2" />
          <Rect x="2" y="2" width="8" height="8" rx="2" />
          <Path d="M7 14v1a2 2 0 0 0 2 2h1" />
          <Path d="M14 7h1a2 2 0 0 1 2 2v1" />
        </>
      )}
    />
  );
}
