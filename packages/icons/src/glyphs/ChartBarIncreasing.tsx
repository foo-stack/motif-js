import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChartBarIncreasing(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M3 3v16a2 2 0 0 0 2 2h16" /><Path d="M7 11h8" /><Path d="M7 16h12" /><Path d="M7 6h3" /></>} />;
}
