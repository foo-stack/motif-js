import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function RedoDot(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="17" r="1" />
          <Path d="M21 7v6h-6" />
          <Path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
        </>
      )}
    />
  );
}
