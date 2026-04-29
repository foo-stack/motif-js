import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TrendingUp(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M16 7h6v6" /><Path d="m22 7-8.5 8.5-5-5L2 17" /></>} />;
}
