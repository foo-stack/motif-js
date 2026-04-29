import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TowerControl(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18.2 12.27 20 6H4l1.8 6.27a1 1 0 0 0 .95.73h10.5a1 1 0 0 0 .96-.73Z" />
          <Path d="M8 13v9" />
          <Path d="M16 22v-9" />
          <Path d="m9 6 1 7" />
          <Path d="m15 6-1 7" />
          <Path d="M12 6V2" />
          <Path d="M13 2h-2" />
        </>
      )}
    />
  );
}
