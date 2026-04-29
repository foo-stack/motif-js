import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Kayak(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18 17a1 1 0 0 0-1 1v1a2 2 0 1 0 2-2z" />
          <Path d="M20.97 3.61a.45.45 0 0 0-.58-.58C10.2 6.6 6.6 10.2 3.03 20.39a.45.45 0 0 0 .58.58C13.8 17.4 17.4 13.8 20.97 3.61" />
          <Path d="m6.707 6.707 10.586 10.586" />
          <Path d="M7 5a2 2 0 1 0-2 2h1a1 1 0 0 0 1-1z" />
        </>
      )}
    />
  );
}
