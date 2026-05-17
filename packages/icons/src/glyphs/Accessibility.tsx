import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Accessibility(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="16" cy="4" r="1" />
          <Path d="m18 19 1-7-6 1" />
          <Path d="m5 8 3-3 5.5 3-2.36 3.5" />
          <Path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
          <Path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
        </>
      )}
    />
  );
}
