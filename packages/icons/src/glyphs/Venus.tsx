import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Venus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M12 15v7" />
          <Path d="M9 19h6" />
          <Circle cx="12" cy="9" r="6" />
        </>
      )}
    />
  );
}
