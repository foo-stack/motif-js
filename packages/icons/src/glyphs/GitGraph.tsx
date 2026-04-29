import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GitGraph(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="5" cy="6" r="3" />
          <Path d="M5 9v6" />
          <Circle cx="5" cy="18" r="3" />
          <Path d="M12 3v18" />
          <Circle cx="19" cy="6" r="3" />
          <Path d="M16 15.7A9 9 0 0 0 19 9" />
        </>
      )}
    />
  );
}
