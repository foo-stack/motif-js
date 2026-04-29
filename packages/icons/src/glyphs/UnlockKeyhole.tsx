import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function UnlockKeyhole(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path, Rect }) => <><Circle cx="12" cy="16" r="1" /><Rect width="18" height="12" x="3" y="10" rx="2" /><Path d="M7 10V7a5 5 0 0 1 9.33-2.5" /></>} />;
}
