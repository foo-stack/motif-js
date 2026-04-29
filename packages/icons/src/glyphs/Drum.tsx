import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Drum(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Ellipse, Path }) => (
        <>
          <Path d="m2 2 8 8" />
          <Path d="m22 2-8 8" />
          <Ellipse cx="12" cy="9" rx="10" ry="5" />
          <Path d="M7 13.4v7.9" />
          <Path d="M12 14v8" />
          <Path d="M17 13.4v7.9" />
          <Path d="M2 9v8a10 5 0 0 0 20 0V9" />
        </>
      )}
    />
  );
}
