import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Repeat1(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m17 2 4 4-4 4" /><Path d="M3 11v-1a4 4 0 0 1 4-4h14" /><Path d="m7 22-4-4 4-4" /><Path d="M21 13v1a4 4 0 0 1-4 4H3" /><Path d="M11 10h1v4" /></>} />;
}
