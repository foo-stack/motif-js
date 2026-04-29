import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function UserPen(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M11.5 15H7a4 4 0 0 0-4 4v2" /><Path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><Circle cx="10" cy="7" r="4" /></>} />;
}
