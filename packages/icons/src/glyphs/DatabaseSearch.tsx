import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function DatabaseSearch(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Ellipse, Path }) => (
        <>
          <Path d="M21 11.693V5" />
          <Path d="m22 22-1.875-1.875" />
          <Path d="M3 12a9 3 0 0 0 8.697 2.998" />
          <Path d="M3 5v14a9 3 0 0 0 9.28 2.999" />
          <Circle cx="18" cy="18" r="3" />
          <Ellipse cx="12" cy="5" rx="9" ry="3" />
        </>
      )}
    />
  );
}
