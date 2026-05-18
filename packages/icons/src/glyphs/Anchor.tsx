import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Anchor(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M12 6v16" />
          <Path d="m19 13 2-1a9 9 0 0 1-18 0l2 1" />
          <Path d="M9 11h6" />
          <Circle cx="12" cy="4" r="2" />
        </>
      )}
    />
  );
}
