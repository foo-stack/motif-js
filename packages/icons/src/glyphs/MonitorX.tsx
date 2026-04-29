import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MonitorX(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="m14.5 12.5-5-5" /><Path d="m9.5 12.5 5-5" /><Rect width="20" height="14" x="2" y="3" rx="2" /><Path d="M12 17v4" /><Path d="M8 21h8" /></>} />;
}
