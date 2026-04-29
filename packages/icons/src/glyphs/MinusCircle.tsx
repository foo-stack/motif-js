import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MinusCircle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M8 12h8" />
        </>
      )}
    />
  );
}
