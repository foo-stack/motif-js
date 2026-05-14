import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Option(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 3h6l6 18h6" />
          <Path d="M14 3h7" />
        </>
      )}
    />
  );
}
