import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SquareStop(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Rect }) => <><Rect width="18" height="18" x="3" y="3" rx="2" /><Rect x="9" y="9" width="6" height="6" rx="1" /></>} />;
}
