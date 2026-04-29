import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Building(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M12 10h.01" /><Path d="M12 14h.01" /><Path d="M12 6h.01" /><Path d="M16 10h.01" /><Path d="M16 14h.01" /><Path d="M16 6h.01" /><Path d="M8 10h.01" /><Path d="M8 14h.01" /><Path d="M8 6h.01" /><Path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" /><Rect x="4" y="2" width="16" height="20" rx="2" /></>} />;
}
