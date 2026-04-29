import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BellElectric(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path, Rect }) => <><Path d="M18.518 17.347A7 7 0 0 1 14 19" /><Path d="M18.8 4A11 11 0 0 1 20 9" /><Path d="M9 9h.01" /><Circle cx="20" cy="16" r="2" /><Circle cx="9" cy="9" r="7" /><Rect x="4" y="16" width="10" height="6" rx="2" /></>} />;
}
