import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Reply(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M20 18v-2a4 4 0 0 0-4-4H4" />
          <Path d="m9 17-5-5 5-5" />
        </>
      )}
    />
  );
}
