import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function PrinterX(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12.531 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h6.377" />
          <Path d="m16.5 16.5 5 5" />
          <Path d="m16.5 21.5 5-5" />
          <Path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.5" />
          <Path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
        </>
      )}
    />
  );
}
