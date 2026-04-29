import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Printer(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <Path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
          <Rect x="6" y="14" width="12" height="8" rx="1" />
        </>
      )}
    />
  );
}
