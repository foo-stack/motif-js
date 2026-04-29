import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronDown(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="m6 9 6 6 6-6" />} />;
}
