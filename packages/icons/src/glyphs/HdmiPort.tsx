import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function HdmiPort(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M22 9a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1l2 2h12l2-2h1a1 1 0 0 0 1-1Z" />
          <Path d="M7.5 12h9" />
        </>
      )}
    />
  );
}
