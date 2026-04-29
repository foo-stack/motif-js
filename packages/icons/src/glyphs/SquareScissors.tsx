import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SquareScissors(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Line, Rect }) => <><Rect width="18" height="18" x="3" y="3" rx="2" /><Circle cx="8.5" cy="8.5" r="1.5" /><Line x1="9.56066" y1="9.56066" x2="12" y2="12" /><Line x1="17" y1="17" x2="14.82" y2="14.82" /><Circle cx="8.5" cy="15.5" r="1.5" /><Line x1="9.56066" y1="14.43934" x2="17" y2="7" /></>} />;
}
