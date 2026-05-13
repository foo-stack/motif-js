import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Feather(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z" />
          <Path d="M16 8 2 22" />
          <Path d="M17.5 15H9" />
        </>
      )}
    />
  );
}
