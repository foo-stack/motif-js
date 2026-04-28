import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Copy(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect, Path }) => (
        <>
          <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </>
      )}
    />
  );
}
