import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Fuel(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5" /><Path d="M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16" /><Path d="M2 21h13" /><Path d="M3 9h11" /></>} />;
}
