import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Code(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Polyline }) => (
        <>
          <Polyline points="16 18 22 12 16 6" />
          <Polyline points="8 6 2 12 8 18" />
        </>
      )}
    />
  );
}
