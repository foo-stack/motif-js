import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ArrowUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m5 12 7-7 7 7" />
          <Path d="M12 19V5" />
        </>
      )}
    />
  );
}
