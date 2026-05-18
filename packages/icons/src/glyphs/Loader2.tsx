import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Loader2(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="M21 12a9 9 0 1 1-6.219-8.56" />} />;
}
