import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowLeftFromLine(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m9 6-6 6 6 6" /><Path d="M3 12h14" /><Path d="M21 19V5" /></>} />;
}
