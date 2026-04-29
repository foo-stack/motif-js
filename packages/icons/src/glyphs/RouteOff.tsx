import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function RouteOff(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="6" cy="19" r="3" /><Path d="M9 19h8.5c.4 0 .9-.1 1.3-.2" /><Path d="M5.2 5.2A3.5 3.53 0 0 0 6.5 12H12" /><Path d="m2 2 20 20" /><Path d="M21 15.3a3.5 3.5 0 0 0-3.3-3.3" /><Path d="M15 5h-4.3" /><Circle cx="18" cy="5" r="3" /></>} />;
}
