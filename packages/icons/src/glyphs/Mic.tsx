import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Mic(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M12 19v3" />
          <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <Rect x="9" y="2" width="6" height="13" rx="3" />
        </>
      )}
    />
  );
}
