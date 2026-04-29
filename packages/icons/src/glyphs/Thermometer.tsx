import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Thermometer(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => <Path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />}
    />
  );
}
