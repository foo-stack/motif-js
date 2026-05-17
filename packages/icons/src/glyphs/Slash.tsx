import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Slash(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="M22 2 2 22" />} />;
}
