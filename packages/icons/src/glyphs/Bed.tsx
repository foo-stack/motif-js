import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Bed(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2 4v16" />
          <Path d="M2 8h18a2 2 0 0 1 2 2v10" />
          <Path d="M2 17h20" />
          <Path d="M6 8v9" />
        </>
      )}
    />
  );
}
