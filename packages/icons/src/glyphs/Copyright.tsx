import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Copyright(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M14.83 14.83a4 4 0 1 1 0-5.66" />
        </>
      )}
    />
  );
}
