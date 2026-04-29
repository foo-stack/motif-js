import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Turntable(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path, Rect }) => <><Path d="M10 12.01h.01" /><Path d="M18 8v4a8 8 0 0 1-1.07 4" /><Circle cx="10" cy="12" r="4" /><Rect x="2" y="4" width="20" height="16" rx="2" /></>} />;
}
