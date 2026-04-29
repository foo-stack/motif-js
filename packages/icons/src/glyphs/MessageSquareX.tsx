import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MessageSquareX(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" /><Path d="m14.5 8.5-5 5" /><Path d="m9.5 8.5 5 5" /></>} />;
}
