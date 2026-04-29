import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Workflow(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="8" height="8" x="3" y="3" rx="2" />
          <Path d="M7 11v4a2 2 0 0 0 2 2h4" />
          <Rect width="8" height="8" x="13" y="13" rx="2" />
        </>
      )}
    />
  );
}
