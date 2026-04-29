import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Link2(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Line, Path }) => <><Path d="M9 17H7A5 5 0 0 1 7 7h2" /><Path d="M15 7h2a5 5 0 1 1 0 10h-2" /><Line x1="8" x2="16" y1="12" y2="12" /></>} />;
}
