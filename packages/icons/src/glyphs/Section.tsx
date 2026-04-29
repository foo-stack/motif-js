import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Section(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 5a4 3 0 0 0-8 0c0 4 8 3 8 7a4 3 0 0 1-8 0" />
          <Path d="M8 19a4 3 0 0 0 8 0c0-4-8-3-8-7a4 3 0 0 1 8 0" />
        </>
      )}
    />
  );
}
