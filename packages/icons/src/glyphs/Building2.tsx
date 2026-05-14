import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Building2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 12h4" />
          <Path d="M10 8h4" />
          <Path d="M14 21v-3a2 2 0 0 0-4 0v3" />
          <Path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
          <Path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
        </>
      )}
    />
  );
}
