import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function IdCardLanyard(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M13.5 8h-3" />
          <Path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" />
          <Path d="M16.899 22A5 5 0 0 0 7.1 22" />
          <Path d="m9 2 3 6" />
          <Circle cx="12" cy="15" r="3" />
        </>
      )}
    />
  );
}
