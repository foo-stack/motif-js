import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowLeftToLine(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M3 19V5" /><Path d="m13 6-6 6 6 6" /><Path d="M7 12h14" /></>} />;
}
