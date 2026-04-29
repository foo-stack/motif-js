import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Stone(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M11.264 2.205A4 4 0 0 0 6.42 4.211l-4 8a4 4 0 0 0 1.359 5.117l6 4a4 4 0 0 0 4.438 0l6-4a4 4 0 0 0 1.576-4.592l-2-6a4 4 0 0 0-2.53-2.53z" /><Path d="M11.99 22 14 12l7.822 3.184" /><Path d="M14 12 8.47 2.302" /></>} />;
}
