import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Clock1(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M12 6v6l2-4" />
        </>
      )}
    />
  );
}
