import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Projector(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M5 7 3 5" />
          <Path d="M9 6V3" />
          <Path d="m13 7 2-2" />
          <Circle cx="9" cy="13" r="3" />
          <Path d="M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17" />
          <Path d="M16 16h2" />
        </>
      )}
    />
  );
}
