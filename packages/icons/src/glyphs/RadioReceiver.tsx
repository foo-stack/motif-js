import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function RadioReceiver(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M5 16v2" />
          <Path d="M19 16v2" />
          <Rect width="20" height="8" x="2" y="8" rx="2" />
          <Path d="M18 12h.01" />
        </>
      )}
    />
  );
}
