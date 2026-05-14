import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Highlighter(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m9 11-6 6v3h9l3-3" />
          <Path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
        </>
      )}
    />
  );
}
