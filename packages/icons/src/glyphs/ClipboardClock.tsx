import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ClipboardClock(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Path d="M16 14v2.2l1.6 1" />
          <Path d="M16 4h2a2 2 0 0 1 2 2v.832" />
          <Path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" />
          <Circle cx="16" cy="16" r="6" />
          <Rect x="8" y="2" width="8" height="4" rx="1" />
        </>
      )}
    />
  );
}
