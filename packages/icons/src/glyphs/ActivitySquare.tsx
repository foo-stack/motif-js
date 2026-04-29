import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ActivitySquare(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="18" height="18" x="3" y="3" rx="2" /><Path d="M17 12h-2l-2 5-2-10-2 5H7" /></>} />;
}
