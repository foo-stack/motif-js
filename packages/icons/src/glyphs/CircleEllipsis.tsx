import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function CircleEllipsis(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M17 12h.01" />
          <Path d="M12 12h.01" />
          <Path d="M7 12h.01" />
        </>
      )}
    />
  );
}
