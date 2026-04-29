import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Diameter(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="19" cy="19" r="2" /><Circle cx="5" cy="5" r="2" /><Path d="M6.48 3.66a10 10 0 0 1 13.86 13.86" /><Path d="m6.41 6.41 11.18 11.18" /><Path d="M3.66 6.48a10 10 0 0 0 13.86 13.86" /></>} />;
}
