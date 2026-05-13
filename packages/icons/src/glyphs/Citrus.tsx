import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Citrus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z" />
          <Path d="M19.65 15.66A8 8 0 0 1 8.35 4.34" />
          <Path d="m14 10-5.5 5.5" />
          <Path d="M14 17.85V10H6.15" />
        </>
      )}
    />
  );
}
