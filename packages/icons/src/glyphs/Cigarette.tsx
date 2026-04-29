import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Cigarette(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M17 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14" /><Path d="M18 8c0-2.5-2-2.5-2-5" /><Path d="M21 16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><Path d="M22 8c0-2.5-2-2.5-2-5" /><Path d="M7 12v4" /></>} />;
}
