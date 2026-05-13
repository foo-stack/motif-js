import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function AlarmClockMinus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="13" r="8" />
          <Path d="M5 3 2 6" />
          <Path d="m22 6-3-3" />
          <Path d="M6.38 18.7 4 21" />
          <Path d="M17.64 18.67 20 21" />
          <Path d="M9 13h6" />
        </>
      )}
    />
  );
}
