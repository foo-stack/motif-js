import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CornerUpLeft(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M20 20v-7a4 4 0 0 0-4-4H4" /><Path d="M9 14 4 9l5-5" /></>} />;
}
