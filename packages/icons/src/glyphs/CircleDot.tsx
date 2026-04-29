import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CircleDot(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Circle cx="12" cy="12" r="1" />
        </>
      )}
    />
  );
}
