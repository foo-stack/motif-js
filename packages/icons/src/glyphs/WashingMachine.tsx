import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function WashingMachine(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path, Rect }) => (
        <>
          <Path d="M3 6h3" />
          <Path d="M17 6h.01" />
          <Rect width="18" height="20" x="3" y="2" rx="2" />
          <Circle cx="12" cy="13" r="5" />
          <Path d="M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5" />
        </>
      )}
    />
  );
}
