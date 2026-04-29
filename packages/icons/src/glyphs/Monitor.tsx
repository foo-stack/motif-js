import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Monitor(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Line, Rect }) => <><Rect width="20" height="14" x="2" y="3" rx="2" /><Line x1="8" x2="16" y1="21" y2="21" /><Line x1="12" x2="12" y1="17" y2="21" /></>} />;
}
