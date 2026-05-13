import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CircleArrowDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M12 8v8" />
          <Path d="m8 12 4 4 4-4" />
        </>
      )}
    />
  );
}
