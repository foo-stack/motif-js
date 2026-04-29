import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function HardHat(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" /><Path d="M14 6a6 6 0 0 1 6 6v3" /><Path d="M4 15v-3a6 6 0 0 1 6-6" /><Rect x="2" y="15" width="20" height="4" rx="1" /></>} />;
}
