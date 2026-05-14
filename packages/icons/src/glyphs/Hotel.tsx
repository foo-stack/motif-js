import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Hotel(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 22v-6.57" />
          <Path d="M12 11h.01" />
          <Path d="M12 7h.01" />
          <Path d="M14 15.43V22" />
          <Path d="M15 16a5 5 0 0 0-6 0" />
          <Path d="M16 11h.01" />
          <Path d="M16 7h.01" />
          <Path d="M8 11h.01" />
          <Path d="M8 7h.01" />
          <Rect x="4" y="2" width="16" height="20" rx="2" />
        </>
      )}
    />
  );
}
