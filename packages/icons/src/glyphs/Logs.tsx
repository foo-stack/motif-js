import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Logs(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M3 5h1" />
          <Path d="M3 12h1" />
          <Path d="M3 19h1" />
          <Path d="M8 5h1" />
          <Path d="M8 12h1" />
          <Path d="M8 19h1" />
          <Path d="M13 5h8" />
          <Path d="M13 12h8" />
          <Path d="M13 19h8" />
        </>
      )}
    />
  );
}
