import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function TextSearch(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M21 5H3" />
          <Path d="M10 12H3" />
          <Path d="M10 19H3" />
          <Circle cx="17" cy="15" r="3" />
          <Path d="m21 19-1.9-1.9" />
        </>
      )}
    />
  );
}
