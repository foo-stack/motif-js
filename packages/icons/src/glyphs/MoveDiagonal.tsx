import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function MoveDiagonal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11 19H5v-6" />
          <Path d="M13 5h6v6" />
          <Path d="M19 5 5 19" />
        </>
      )}
    />
  );
}
