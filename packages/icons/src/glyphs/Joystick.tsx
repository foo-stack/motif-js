import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Joystick(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z" />
          <Path d="M6 15v-2" />
          <Path d="M12 15V9" />
          <Circle cx="12" cy="6" r="3" />
        </>
      )}
    />
  );
}
