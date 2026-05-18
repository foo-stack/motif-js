import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Heading2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 12h8" />
          <Path d="M4 18V6" />
          <Path d="M12 18V6" />
          <Path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
        </>
      )}
    />
  );
}
