import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ZodiacCapricorn(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M11 21a3 3 0 0 0 3-3V6.5a1 1 0 0 0-7 0" />
          <Path d="M7 19V6a3 3 0 0 0-3-3h0" />
          <Circle cx="17" cy="17" r="3" />
        </>
      )}
    />
  );
}
