import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SquareStack(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" /><Path d="M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" /><Rect width="8" height="8" x="14" y="14" rx="2" /></>} />;
}
