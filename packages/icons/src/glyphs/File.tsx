import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function File(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Polyline }) => (
        <>
          <Path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <Polyline points="13 2 13 9 20 9" />
        </>
      )}
    />
  );
}
