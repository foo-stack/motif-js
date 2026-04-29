import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Video(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
          <Rect x="2" y="6" width="14" height="12" rx="2" />
        </>
      )}
    />
  );
}
