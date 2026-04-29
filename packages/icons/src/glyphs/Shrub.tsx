import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Shrub(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 22v-5.172a2 2 0 0 0-.586-1.414L9.5 13.5" />
          <Path d="M14.5 14.5 12 17" />
          <Path d="M17 8.8A6 6 0 0 1 13.8 20H10A6.5 6.5 0 0 1 7 8a5 5 0 0 1 10 0z" />
        </>
      )}
    />
  );
}
