import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowDownRightFromCircle(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 22a10 10 0 1 1 10-10" /><Path d="M22 22 12 12" /><Path d="M22 16v6h-6" /></>} />;
}
