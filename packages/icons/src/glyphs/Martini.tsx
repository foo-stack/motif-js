import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Martini(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M8 22h8" />
          <Path d="M12 11v11" />
          <Path d="m19 3-7 8-7-8Z" />
        </>
      )}
    />
  );
}
