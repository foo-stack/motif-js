import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Trash(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Polyline }) => (
        <>
          <Polyline points="3 6 5 6 21 6" />
          <Path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          <Path d="M10 11v6" />
          <Path d="M14 11v6" />
          <Path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
        </>
      )}
    />
  );
}
