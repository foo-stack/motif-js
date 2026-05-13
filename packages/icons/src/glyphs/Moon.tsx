import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Moon(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <Path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
      )}
    />
  );
}
