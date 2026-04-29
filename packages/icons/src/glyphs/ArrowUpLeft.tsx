import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowUpLeft(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M7 17V7h10" /><Path d="M17 17 7 7" /></>} />;
}
