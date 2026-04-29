import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CalendarDays(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M8 2v4" /><Path d="M16 2v4" /><Rect width="18" height="18" x="3" y="4" rx="2" /><Path d="M3 10h18" /><Path d="M8 14h.01" /><Path d="M12 14h.01" /><Path d="M16 14h.01" /><Path d="M8 18h.01" /><Path d="M12 18h.01" /><Path d="M16 18h.01" /></>} />;
}
