import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function MoveDiagonal2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M19 13v6h-6" />
          <Path d="M5 11V5h6" />
          <Path d="m5 5 14 14" />
        </>
      )}
    />
  );
}
