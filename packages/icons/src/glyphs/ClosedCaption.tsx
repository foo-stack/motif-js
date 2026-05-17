import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ClosedCaption(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M10 9.17a3 3 0 1 0 0 5.66" />
          <Path d="M17 9.17a3 3 0 1 0 0 5.66" />
          <Rect x="2" y="5" width="20" height="14" rx="2" />
        </>
      )}
    />
  );
}
