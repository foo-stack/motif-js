import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Ban(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M4.929 4.929 19.07 19.071" />
        </>
      )}
    />
  );
}
