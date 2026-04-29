import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BatteryFull(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M10 10v4" /><Path d="M14 10v4" /><Path d="M22 14v-4" /><Path d="M6 10v4" /><Rect x="2" y="6" width="16" height="12" rx="2" /></>} />;
}
