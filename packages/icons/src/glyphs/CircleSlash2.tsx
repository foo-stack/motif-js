import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CircleSlash2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M22 2 2 22" />
        </>
      )}
    />
  );
}
