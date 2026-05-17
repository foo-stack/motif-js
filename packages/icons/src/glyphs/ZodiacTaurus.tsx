import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function ZodiacTaurus(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="15" r="6" />
          <Path d="M18 3A6 6 0 0 1 6 3" />
        </>
      )}
    />
  );
}
