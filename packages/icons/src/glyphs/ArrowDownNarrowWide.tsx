import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ArrowDownNarrowWide(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m3 16 4 4 4-4" />
          <Path d="M7 20V4" />
          <Path d="M11 4h4" />
          <Path d="M11 8h7" />
          <Path d="M11 12h10" />
        </>
      )}
    />
  );
}
