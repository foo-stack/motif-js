import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function RotateCcwKey(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M12 7v6" />
          <Path d="M12 9h2" />
          <Path d="M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8" />
          <Path d="M3 3v5h5" />
          <Circle cx="12" cy="15" r="2" />
        </>
      )}
    />
  );
}
