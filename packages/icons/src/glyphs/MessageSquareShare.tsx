import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function MessageSquareShare(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4" />
          <Path d="M16 3h6v6" />
          <Path d="m16 9 6-6" />
        </>
      )}
    />
  );
}
