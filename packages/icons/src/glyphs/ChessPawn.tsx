import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ChessPawn(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
          <Path d="m14.5 10 1.5 8" />
          <Path d="M7 10h10" />
          <Path d="m8 18 1.5-8" />
          <Circle cx="12" cy="6" r="4" />
        </>
      )}
    />
  );
}
