import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function PencilLine(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M13 21h8" />
          <Path d="m15 5 4 4" />
          <Path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        </>
      )}
    />
  );
}
