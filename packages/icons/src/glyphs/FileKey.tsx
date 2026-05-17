import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function FileKey(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M14 2v5a1 1 0 0 0 1 1h5" />
          <Path d="M4 12v6" />
          <Path d="M4 14h2" />
          <Path d="M9.65 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v4" />
          <Circle cx="4" cy="20" r="2" />
        </>
      )}
    />
  );
}
