import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CalendarPlus(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M16 19h6" /><Path d="M16 2v4" /><Path d="M19 16v6" /><Path d="M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5" /><Path d="M3 10h18" /><Path d="M8 2v4" /></>} />;
}
