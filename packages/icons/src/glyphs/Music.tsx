import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Music(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M9 18V5l12-2v13" />
          <Circle cx="6" cy="18" r="3" />
          <Circle cx="18" cy="16" r="3" />
        </>
      )}
    />
  );
}
