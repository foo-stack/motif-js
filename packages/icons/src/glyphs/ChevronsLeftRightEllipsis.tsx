import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ChevronsLeftRightEllipsis(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M12 12h.01" />
          <Path d="M16 12h.01" />
          <Path d="m17 7 5 5-5 5" />
          <Path d="m7 7-5 5 5 5" />
          <Path d="M8 12h.01" />
        </>
      )}
    />
  );
}
