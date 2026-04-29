import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ReplaceAll(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M14 14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1" /><Path d="M14 4a1 1 0 0 1 1-1" /><Path d="M15 10a1 1 0 0 1-1-1" /><Path d="M19 14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1" /><Path d="M21 4a1 1 0 0 0-1-1" /><Path d="M21 9a1 1 0 0 1-1 1" /><Path d="m3 7 3 3 3-3" /><Path d="M6 10V5a2 2 0 0 1 2-2h2" /><Rect x="3" y="14" width="7" height="7" rx="1" /></>} />;
}
