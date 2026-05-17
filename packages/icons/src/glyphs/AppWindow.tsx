import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function AppWindow(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect x="2" y="4" width="20" height="16" rx="2" />
          <Path d="M10 4v4" />
          <Path d="M2 8h20" />
          <Path d="M6 4v4" />
        </>
      )}
    />
  );
}
