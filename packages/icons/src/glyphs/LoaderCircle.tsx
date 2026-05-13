import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function LoaderCircle(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="M21 12a9 9 0 1 1-6.219-8.56" />} />;
}
