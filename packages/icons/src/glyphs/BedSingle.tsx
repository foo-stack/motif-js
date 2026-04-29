import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BedSingle(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" /><Path d="M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" /><Path d="M3 18h18" /></>} />;
}
