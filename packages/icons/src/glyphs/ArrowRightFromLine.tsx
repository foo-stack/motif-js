import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowRightFromLine(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M3 5v14" /><Path d="M21 12H7" /><Path d="m15 18 6-6-6-6" /></>} />;
}
