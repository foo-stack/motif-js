import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ServerCrash(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><Path d="M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" /><Path d="M6 6h.01" /><Path d="M6 18h.01" /><Path d="m13 6-4 6h6l-4 6" /></>} />;
}
