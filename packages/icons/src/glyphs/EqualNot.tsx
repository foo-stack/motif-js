import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function EqualNot(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line }) => (
        <>
          <Line x1="5" x2="19" y1="9" y2="9" />
          <Line x1="5" x2="19" y1="15" y2="15" />
          <Line x1="19" x2="5" y1="5" y2="19" />
        </>
      )}
    />
  );
}
