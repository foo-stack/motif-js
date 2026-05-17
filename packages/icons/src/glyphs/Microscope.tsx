import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Microscope(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M6 18h8" />
          <Path d="M3 22h18" />
          <Path d="M14 22a7 7 0 1 0 0-14h-1" />
          <Path d="M9 14h2" />
          <Path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
          <Path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
        </>
      )}
    />
  );
}
