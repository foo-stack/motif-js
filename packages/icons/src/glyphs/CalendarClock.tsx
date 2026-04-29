import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CalendarClock(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M16 14v2.2l1.6 1" /><Path d="M16 2v4" /><Path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" /><Path d="M3 10h5" /><Path d="M8 2v4" /><Circle cx="16" cy="16" r="6" /></>} />;
}
