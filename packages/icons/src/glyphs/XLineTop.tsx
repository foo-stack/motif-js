import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function XLineTop(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M18 4H6" />
          <Path d="M18 8 6 20" />
          <Path d="m6 8 12 12" />
        </>
      )}
    />
  );
}
