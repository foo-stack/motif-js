import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FileClock(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M16 22h2a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v2.85" /><Path d="M14 2v5a1 1 0 0 0 1 1h5" /><Path d="M8 14v2.2l1.6 1" /><Circle cx="8" cy="16" r="6" /></>} />;
}
