import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Navigation2Off(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Line, Path }) => <><Path d="M9.31 9.31 5 21l7-4 7 4-1.17-3.17" /><Path d="M14.53 8.88 12 2l-1.17 3.17" /><Line x1="2" x2="22" y1="2" y2="22" /></>} />;
}
