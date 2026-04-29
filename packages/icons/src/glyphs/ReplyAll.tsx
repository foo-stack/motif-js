import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ReplyAll(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m12 17-5-5 5-5" />
          <Path d="M22 18v-2a4 4 0 0 0-4-4H7" />
          <Path d="m7 17-5-5 5-5" />
        </>
      )}
    />
  );
}
