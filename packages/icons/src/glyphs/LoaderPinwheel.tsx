import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function LoaderPinwheel(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" />
          <Path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" />
          <Path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" />
          <Circle cx="12" cy="12" r="10" />
        </>
      )}
    />
  );
}
