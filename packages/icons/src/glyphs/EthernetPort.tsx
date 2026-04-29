import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function EthernetPort(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m15 20 3-3h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2l3 3z" /><Path d="M6 8v1" /><Path d="M10 8v1" /><Path d="M14 8v1" /><Path d="M18 8v1" /></>} />;
}
