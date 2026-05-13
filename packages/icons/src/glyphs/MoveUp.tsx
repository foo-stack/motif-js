import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function MoveUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M8 6L12 2L16 6" />
          <Path d="M12 2V22" />
        </>
      )}
    />
  );
}
