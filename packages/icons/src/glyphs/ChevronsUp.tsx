import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronsUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m17 11-5-5-5 5" />
          <Path d="m17 18-5-5-5 5" />
        </>
      )}
    />
  );
}
