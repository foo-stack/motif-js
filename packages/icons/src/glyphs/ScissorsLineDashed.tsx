import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ScissorsLineDashed(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M5.42 9.42 8 12" />
          <Circle cx="4" cy="8" r="2" />
          <Path d="m14 6-8.58 8.58" />
          <Circle cx="4" cy="16" r="2" />
          <Path d="M10.8 14.8 14 18" />
          <Path d="M16 12h-2" />
          <Path d="M22 12h-2" />
        </>
      )}
    />
  );
}
