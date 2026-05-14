import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Asterisk(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 6v12" />
          <Path d="M17.196 9 6.804 15" />
          <Path d="m6.804 9 10.392 6" />
        </>
      )}
    />
  );
}
