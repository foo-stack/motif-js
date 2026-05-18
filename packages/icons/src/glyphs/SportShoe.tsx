import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SportShoe(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m15 10.42 4.8-5.07" />
          <Path d="M19 18h3" />
          <Path d="M9.5 22 21.414 9.415A2 2 0 0 0 21.2 6.4l-5.61-4.208A1 1 0 0 0 14 3v2a2 2 0 0 1-1.394 1.906L8.677 8.053A1 1 0 0 0 8 9c-.155 6.393-2.082 9-4 9a2 2 0 0 0 0 4h14" />
        </>
      )}
    />
  );
}
