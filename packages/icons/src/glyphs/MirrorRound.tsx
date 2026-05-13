import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function MirrorRound(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M10 6.6 8.6 8" />
          <Path d="M12 18v4" />
          <Path d="M15 7.5 9.5 13" />
          <Path d="M7 22h10" />
          <Circle cx="12" cy="10" r="8" />
        </>
      )}
    />
  );
}
