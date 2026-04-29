import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MonitorUp(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="m9 10 3-3 3 3" /><Path d="M12 13V7" /><Rect width="20" height="14" x="2" y="3" rx="2" /><Path d="M12 17v4" /><Path d="M8 21h8" /></>} />;
}
