import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BarChart(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M5 21v-6" /><Path d="M12 21V9" /><Path d="M19 21V3" /></>} />;
}
