import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function LogIn(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m10 17 5-5-5-5" /><Path d="M15 12H3" /><Path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></>} />;
}
