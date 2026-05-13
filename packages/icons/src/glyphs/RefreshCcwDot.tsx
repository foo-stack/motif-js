import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function RefreshCcwDot(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <Path d="M3 3v5h5" />
          <Path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <Path d="M16 16h5v5" />
          <Circle cx="12" cy="12" r="1" />
        </>
      )}
    />
  );
}
