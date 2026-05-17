import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Menu(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M4 5h16" />
          <Path d="M4 12h16" />
          <Path d="M4 19h16" />
        </>
      )}
    />
  );
}
