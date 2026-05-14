import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Spotlight(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M15.295 19.562 16 22" />
          <Path d="m17 16 3.758 2.098" />
          <Path d="m19 12.5 3.026-.598" />
          <Path d="M7.61 6.3a3 3 0 0 0-3.92 1.3l-1.38 2.79a3 3 0 0 0 1.3 3.91l6.89 3.597a1 1 0 0 0 1.342-.447l3.106-6.211a1 1 0 0 0-.447-1.341z" />
          <Path d="M8 9V2" />
        </>
      )}
    />
  );
}
