import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Ambulance(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M10 10H6" />
          <Path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <Path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14" />
          <Path d="M8 8v4" />
          <Path d="M9 18h6" />
          <Circle cx="17" cy="18" r="2" />
          <Circle cx="7" cy="18" r="2" />
        </>
      )}
    />
  );
}
