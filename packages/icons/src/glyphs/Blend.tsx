import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Blend(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle }) => (
        <>
          <Circle cx="9" cy="9" r="7" />
          <Circle cx="15" cy="15" r="7" />
        </>
      )}
    />
  );
}
