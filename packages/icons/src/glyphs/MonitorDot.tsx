import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MonitorDot(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M12 17v4" /><Path d="M22 12.307V15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8.693" /><Path d="M8 21h8" /><Circle cx="19" cy="6" r="3" /></>} />;
}
