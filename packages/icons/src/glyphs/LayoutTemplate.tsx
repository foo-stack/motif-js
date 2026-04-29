import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function LayoutTemplate(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Rect }) => <><Rect width="18" height="7" x="3" y="3" rx="1" /><Rect width="9" height="7" x="3" y="14" rx="1" /><Rect width="5" height="7" x="16" y="14" rx="1" /></>} />;
}
