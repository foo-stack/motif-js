import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function LockOpen(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><Path d="M7 11V7a5 5 0 0 1 9.9-1" /></>} />;
}
