import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function Space(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => <Path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />}
    />
  );
}
