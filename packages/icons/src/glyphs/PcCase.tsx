import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PcCase(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="14" height="20" x="5" y="2" rx="2" /><Path d="M15 14h.01" /><Path d="M9 6h6" /><Path d="M9 10h6" /></>} />;
}
