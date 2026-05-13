import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function ChevronLeft(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="m15 18-6-6 6-6" />} />;
}
