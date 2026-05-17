import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Scale(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 3v18" />
          <Path d="m19 8 3 8a5 5 0 0 1-6 0zV7" />
          <Path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" />
          <Path d="m5 8 3 8a5 5 0 0 1-6 0zV7" />
          <Path d="M7 21h10" />
        </>
      )}
    />
  );
}
