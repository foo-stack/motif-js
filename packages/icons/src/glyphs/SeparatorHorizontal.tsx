import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SeparatorHorizontal(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m16 16-4 4-4-4" />
          <Path d="M3 12h18" />
          <Path d="m8 8 4-4 4 4" />
        </>
      )}
    />
  );
}
