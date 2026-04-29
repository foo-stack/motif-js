import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BusFront(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M4 6 2 7" /><Path d="M10 6h4" /><Path d="m22 7-2-1" /><Rect width="16" height="16" x="4" y="3" rx="2" /><Path d="M4 11h16" /><Path d="M8 15h.01" /><Path d="M16 15h.01" /><Path d="M6 19v2" /><Path d="M18 21v-2" /></>} />;
}
