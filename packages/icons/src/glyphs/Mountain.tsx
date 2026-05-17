import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Mountain(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="m8 3 4 8 5-5 5 15H2L8 3z" />} />;
}
