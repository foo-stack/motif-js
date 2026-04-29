import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Newspaper(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M15 18h-5" />
          <Path d="M18 14h-8" />
          <Path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" />
          <Rect width="8" height="4" x="10" y="6" rx="1" />
        </>
      )}
    />
  );
}
