import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowUpToLine(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M5 3h14" /><Path d="m18 13-6-6-6 6" /><Path d="M12 7v14" /></>} />;
}
