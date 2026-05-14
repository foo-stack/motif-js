import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Plus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M5 12h14" />
          <Path d="M12 5v14" />
        </>
      )}
    />
  );
}
