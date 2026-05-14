import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Smartphone(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <Path d="M12 18h.01" />
        </>
      )}
    />
  );
}
