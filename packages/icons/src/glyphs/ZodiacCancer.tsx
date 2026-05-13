import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ZodiacCancer(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M21 14.5A9 6.5 0 0 1 5.5 19" />
          <Path d="M3 9.5A9 6.5 0 0 1 18.5 5" />
          <Circle cx="17.5" cy="14.5" r="3.5" />
          <Circle cx="6.5" cy="9.5" r="3.5" />
        </>
      )}
    />
  );
}
