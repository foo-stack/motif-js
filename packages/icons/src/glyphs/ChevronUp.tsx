import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronUp(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="m18 15-6-6-6 6" />} />;
}
