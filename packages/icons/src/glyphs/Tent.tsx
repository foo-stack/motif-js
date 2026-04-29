import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Tent(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M3.5 21 14 3" /><Path d="M20.5 21 10 3" /><Path d="M15.5 21 12 15l-3.5 6" /><Path d="M2 21h20" /></>} />;
}
