import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Motorbike(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="m18 14-1-3" /><Path d="m3 9 6 2a2 2 0 0 1 2-2h2a2 2 0 0 1 1.99 1.81" /><Path d="M8 17h3a1 1 0 0 0 1-1 6 6 0 0 1 6-6 1 1 0 0 0 1-1v-.75A5 5 0 0 0 17 5" /><Circle cx="19" cy="17" r="3" /><Circle cx="5" cy="17" r="3" /></>} />;
}
