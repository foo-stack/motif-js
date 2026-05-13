import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CandyOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 10v7.9" />
          <Path d="M11.802 6.145a5 5 0 0 1 6.053 6.053" />
          <Path d="M14 6.1v2.243" />
          <Path d="m15.5 15.571-.964.964a5 5 0 0 1-7.071 0 5 5 0 0 1 0-7.07l.964-.965" />
          <Path d="M16 7V3a1 1 0 0 1 1.707-.707 2.5 2.5 0 0 0 2.152.717 1 1 0 0 1 1.131 1.131 2.5 2.5 0 0 0 .717 2.152A1 1 0 0 1 21 8h-4" />
          <Path d="m2 2 20 20" />
          <Path d="M8 17v4a1 1 0 0 1-1.707.707 2.5 2.5 0 0 0-2.152-.717 1 1 0 0 1-1.131-1.131 2.5 2.5 0 0 0-.717-2.152A1 1 0 0 1 3 16h4" />
        </>
      )}
    />
  );
}
