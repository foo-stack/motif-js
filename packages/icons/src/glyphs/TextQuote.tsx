import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TextQuote(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M17 5H3" />
          <Path d="M21 12H8" />
          <Path d="M21 19H8" />
          <Path d="M3 12v7" />
        </>
      )}
    />
  );
}
