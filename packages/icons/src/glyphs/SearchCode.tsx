import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SearchCode(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="m13 13.5 2-2.5-2-2.5" />
          <Path d="m21 21-4.3-4.3" />
          <Path d="M9 8.5 7 11l2 2.5" />
          <Circle cx="11" cy="11" r="8" />
        </>
      )}
    />
  );
}
