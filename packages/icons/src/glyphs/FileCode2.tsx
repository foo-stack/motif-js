import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FileCode2(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M4 12.15V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-3.35" /><Path d="M14 2v5a1 1 0 0 0 1 1h5" /><Path d="m5 16-3 3 3 3" /><Path d="m9 22 3-3-3-3" /></>} />;
}
