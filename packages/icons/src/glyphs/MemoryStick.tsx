import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MemoryStick(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M12 12v-2" />
          <Path d="M12 18v-2" />
          <Path d="M16 12v-2" />
          <Path d="M16 18v-2" />
          <Path d="M2 11h1.5" />
          <Path d="M20 18v-2" />
          <Path d="M20.5 11H22" />
          <Path d="M4 18v-2" />
          <Path d="M8 12v-2" />
          <Path d="M8 18v-2" />
          <Rect x="2" y="6" width="20" height="10" rx="2" />
        </>
      )}
    />
  );
}
