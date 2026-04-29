import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChartColumnStacked(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M11 13H7" /><Path d="M19 9h-4" /><Path d="M3 3v16a2 2 0 0 0 2 2h16" /><Rect x="15" y="5" width="4" height="12" rx="1" /><Rect x="7" y="8" width="4" height="9" rx="1" /></>} />;
}
