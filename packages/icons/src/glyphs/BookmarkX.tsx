import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function BookmarkX(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m14.5 7.5-5 5" />
          <Path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
          <Path d="m9.5 7.5 5 5" />
        </>
      )}
    />
  );
}
