import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Code2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m18 16 4-4-4-4" />
          <Path d="m6 8-4 4 4 4" />
          <Path d="m14.5 4-5 16" />
        </>
      )}
    />
  );
}
