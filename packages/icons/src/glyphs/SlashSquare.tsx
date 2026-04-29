import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SlashSquare(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Line, Rect }) => <><Rect width="18" height="18" x="3" y="3" rx="2" /><Line x1="9" x2="15" y1="15" y2="9" /></>} />;
}
