import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Music2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="8" cy="18" r="4" />
          <Path d="M12 18V2l7 4" />
        </>
      )}
    />
  );
}
