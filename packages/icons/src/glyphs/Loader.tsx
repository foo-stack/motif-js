import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Loader(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 2v4" />
          <Path d="m16.2 7.8 2.9-2.9" />
          <Path d="M18 12h4" />
          <Path d="m16.2 16.2 2.9 2.9" />
          <Path d="M12 18v4" />
          <Path d="m4.9 19.1 2.9-2.9" />
          <Path d="M2 12h4" />
          <Path d="m4.9 4.9 2.9 2.9" />
        </>
      )}
    />
  );
}
