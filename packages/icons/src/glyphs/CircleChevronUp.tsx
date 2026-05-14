import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CircleChevronUp(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="10" />
          <Path d="m8 14 4-4 4 4" />
        </>
      )}
    />
  );
}
