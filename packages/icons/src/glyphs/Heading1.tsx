import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Heading1(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 12h8" />
          <Path d="M4 18V6" />
          <Path d="M12 18V6" />
          <Path d="m17 12 3-2v8" />
        </>
      )}
    />
  );
}
