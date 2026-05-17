import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CornerLeftDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m14 15-5 5-5-5" />
          <Path d="M20 4h-7a4 4 0 0 0-4 4v12" />
        </>
      )}
    />
  );
}
