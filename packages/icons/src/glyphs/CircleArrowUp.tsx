import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CircleArrowUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="m16 12-4-4-4 4" />
          <Path d="M12 16V8" />
        </>
      )}
    />
  );
}
