import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ExternalLink(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M15 3h6v6" />
          <Path d="M10 14 21 3" />
          <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </>
      )}
    />
  );
}
