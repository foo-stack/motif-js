import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BetweenVerticalEnd(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="7" height="13" x="3" y="3" rx="1" /><Path d="m9 22 3-3 3 3" /><Rect width="7" height="13" x="14" y="3" rx="1" /></>} />;
}
