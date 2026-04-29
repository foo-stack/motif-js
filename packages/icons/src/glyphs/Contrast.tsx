import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Contrast(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M12 18a6 6 0 0 0 0-12v12z" />
        </>
      )}
    />
  );
}
