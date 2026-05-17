import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Scissors(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="6" cy="6" r="3" />
          <Path d="M8.12 8.12 12 12" />
          <Path d="M20 4 8.12 15.88" />
          <Circle cx="6" cy="18" r="3" />
          <Path d="M14.8 14.8 20 20" />
        </>
      )}
    />
  );
}
