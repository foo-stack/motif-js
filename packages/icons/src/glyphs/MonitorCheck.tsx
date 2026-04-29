import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MonitorCheck(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="m9 10 2 2 4-4" /><Rect width="20" height="14" x="2" y="3" rx="2" /><Path d="M12 17v4" /><Path d="M8 21h8" /></>} />;
}
