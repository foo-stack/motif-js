import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Blocks(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2" />
          <Rect x="14" y="2" width="8" height="8" rx="1" />
        </>
      )}
    />
  );
}
