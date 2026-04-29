import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronRight(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="m9 18 6-6-6-6" />} />;
}
