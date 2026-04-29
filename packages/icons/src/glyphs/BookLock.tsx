import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BookLock(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M18 6V4a2 2 0 1 0-4 0v2" /><Path d="M20 15v6a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><Path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10" /><Rect x="12" y="6" width="8" height="5" rx="1" /></>} />;
}
