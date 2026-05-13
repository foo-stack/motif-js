import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TableOfContents(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M16 5H3" />
          <Path d="M16 12H3" />
          <Path d="M16 19H3" />
          <Path d="M21 5h.01" />
          <Path d="M21 12h.01" />
          <Path d="M21 19h.01" />
        </>
      )}
    />
  );
}
