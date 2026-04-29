import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CalendarMinus2(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M8 2v4" /><Path d="M16 2v4" /><Rect width="18" height="18" x="3" y="4" rx="2" /><Path d="M3 10h18" /><Path d="M10 16h4" /></>} />;
}
