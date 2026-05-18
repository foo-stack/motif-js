import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Webcam(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="10" r="8" />
          <Circle cx="12" cy="10" r="3" />
          <Path d="M7 22h10" />
          <Path d="M12 22v-4" />
        </>
      )}
    />
  );
}
