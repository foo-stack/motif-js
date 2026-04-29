import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function LogOut(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m16 17 5-5-5-5" /><Path d="M21 12H9" /><Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></>} />;
}
