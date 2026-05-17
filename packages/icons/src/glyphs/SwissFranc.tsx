import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SwissFranc(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 21V3h8" />
          <Path d="M6 16h9" />
          <Path d="M10 9.5h7" />
        </>
      )}
    />
  );
}
