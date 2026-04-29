import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BriefcaseConveyorBelt(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 20v2" />
          <Path d="M14 20v2" />
          <Path d="M18 20v2" />
          <Path d="M21 20H3" />
          <Path d="M6 20v2" />
          <Path d="M8 16V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12" />
          <Rect x="4" y="6" width="16" height="10" rx="2" />
        </>
      )}
    />
  );
}
