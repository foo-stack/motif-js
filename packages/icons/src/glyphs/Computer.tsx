import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Computer(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="14" height="8" x="5" y="2" rx="2" />
          <Rect width="20" height="8" x="2" y="14" rx="2" />
          <Path d="M6 18h2" />
          <Path d="M12 18h6" />
        </>
      )}
    />
  );
}
