import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CloudOff(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M10.94 5.274A7 7 0 0 1 15.71 10h1.79a4.5 4.5 0 0 1 4.222 6.057" /><Path d="M18.796 18.81A4.5 4.5 0 0 1 17.5 19H9A7 7 0 0 1 5.79 5.78" /><Path d="m2 2 20 20" /></>} />;
}
