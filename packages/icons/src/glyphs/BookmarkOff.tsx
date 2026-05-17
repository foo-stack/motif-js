import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function BookmarkOff(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M19 19v1a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5" />
          <Path d="m2 2 20 20" />
          <Path d="M8.656 3H17a2 2 0 0 1 2 2v8.344" />
        </>
      )}
    />
  );
}
