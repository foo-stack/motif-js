import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Heading(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M6 12h12" />
          <Path d="M6 20V4" />
          <Path d="M18 20V4" />
        </>
      )}
    />
  );
}
