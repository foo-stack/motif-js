import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Wallpaper(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Path d="M12 17v4" />
          <Path d="M8 21h8" />
          <Path d="m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15" />
          <Circle cx="8" cy="9" r="2" />
          <Rect x="2" y="3" width="20" height="14" rx="2" />
        </>
      )}
    />
  );
}
