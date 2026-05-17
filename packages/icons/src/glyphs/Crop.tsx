import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Crop(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M6 2v14a2 2 0 0 0 2 2h14" />
          <Path d="M18 22V8a2 2 0 0 0-2-2H2" />
        </>
      )}
    />
  );
}
