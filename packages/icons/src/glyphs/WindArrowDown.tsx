import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function WindArrowDown(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 2v8" />
          <Path d="M12.8 21.6A2 2 0 1 0 14 18H2" />
          <Path d="M17.5 10a2.5 2.5 0 1 1 2 4H2" />
          <Path d="m6 6 4 4 4-4" />
        </>
      )}
    />
  );
}
