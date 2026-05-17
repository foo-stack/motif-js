import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ListOrdered(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M11 5h10" />
          <Path d="M11 12h10" />
          <Path d="M11 19h10" />
          <Path d="M4 4h1v5" />
          <Path d="M4 9h2" />
          <Path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" />
        </>
      )}
    />
  );
}
