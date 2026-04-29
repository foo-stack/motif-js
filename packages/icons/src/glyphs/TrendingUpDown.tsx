import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TrendingUpDown(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M14.828 14.828 21 21" /><Path d="M21 16v5h-5" /><Path d="m21 3-9 9-4-4-6 6" /><Path d="M21 8V3h-5" /></>} />;
}
