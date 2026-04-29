import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PanelLeftRightDashed(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M15 10V9" /><Path d="M15 15v-1" /><Path d="M15 21v-2" /><Path d="M15 5V3" /><Path d="M9 10V9" /><Path d="M9 15v-1" /><Path d="M9 21v-2" /><Path d="M9 5V3" /><Rect x="3" y="3" width="18" height="18" rx="2" /></>} />;
}
