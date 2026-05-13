import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Barcode(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 5v14" />
          <Path d="M8 5v14" />
          <Path d="M12 5v14" />
          <Path d="M17 5v14" />
          <Path d="M21 5v14" />
        </>
      )}
    />
  );
}
