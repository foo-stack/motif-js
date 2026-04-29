import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Tickets(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="m3.173 8.18 11-5a2 2 0 0 1 2.647.993L18.56 8" /><Path d="M6 10V8" /><Path d="M6 14v1" /><Path d="M6 19v2" /><Rect x="2" y="8" width="20" height="13" rx="2" /></>} />;
}
