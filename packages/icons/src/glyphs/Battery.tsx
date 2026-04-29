import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Battery(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M 22 14 L 22 10" />
          <Rect x="2" y="6" width="16" height="12" rx="2" />
        </>
      )}
    />
  );
}
