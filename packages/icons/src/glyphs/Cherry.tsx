import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Cherry(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" /><Path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" /><Path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12" /><Path d="M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z" /></>} />;
}
