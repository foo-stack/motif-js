import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Calendars(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M12 2v2" />
          <Path d="M15.726 21.01A2 2 0 0 1 14 22H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2" />
          <Path d="M18 2v2" />
          <Path d="M2 13h2" />
          <Path d="M8 8h14" />
          <Rect x="8" y="3" width="14" height="14" rx="2" />
        </>
      )}
    />
  );
}
