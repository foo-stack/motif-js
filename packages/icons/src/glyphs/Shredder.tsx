import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Shredder(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M4 13V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5" /><Path d="M14 2v5a1 1 0 0 0 1 1h5" /><Path d="M10 22v-5" /><Path d="M14 19v-2" /><Path d="M18 20v-3" /><Path d="M2 13h20" /><Path d="M6 20v-3" /></>} />;
}
