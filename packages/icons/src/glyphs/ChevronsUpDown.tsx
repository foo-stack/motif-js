import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ChevronsUpDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m7 15 5 5 5-5" />
          <Path d="m7 9 5-5 5 5" />
        </>
      )}
    />
  );
}
