import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Castle(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M10 5V3" /><Path d="M14 5V3" /><Path d="M15 21v-3a3 3 0 0 0-6 0v3" /><Path d="M18 3v8" /><Path d="M18 5H6" /><Path d="M22 11H2" /><Path d="M22 9v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9" /><Path d="M6 3v8" /></>} />;
}
