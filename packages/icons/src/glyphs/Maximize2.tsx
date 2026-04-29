import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Maximize2(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M15 3h6v6" /><Path d="m21 3-7 7" /><Path d="m3 21 7-7" /><Path d="M9 21H3v-6" /></>} />;
}
