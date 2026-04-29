import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FileSearch2(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M11.1 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.589 3.588A2.4 2.4 0 0 1 20 8v3.25" /><Path d="M14 2v5a1 1 0 0 0 1 1h5" /><Path d="m21 22-2.88-2.88" /><Circle cx="16" cy="17" r="3" /></>} />;
}
