import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Archive(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="20" height="5" x="2" y="3" rx="1" />
          <Path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
          <Path d="M10 12h4" />
        </>
      )}
    />
  );
}
