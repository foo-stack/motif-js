import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function PercentCircle(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="m15 9-6 6" />
          <Path d="M9 9h.01" />
          <Path d="M15 15h.01" />
        </>
      )}
    />
  );
}
