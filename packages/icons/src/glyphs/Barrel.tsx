import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Barrel(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M10 3a41 41 0 0 0 0 18" /><Path d="M14 3a41 41 0 0 1 0 18" /><Path d="M17 3a2 2 0 0 1 1.68.92 15.25 15.25 0 0 1 0 16.16A2 2 0 0 1 17 21H7a2 2 0 0 1-1.68-.92 15.25 15.25 0 0 1 0-16.16A2 2 0 0 1 7 3z" /><Path d="M3.84 17h16.32" /><Path d="M3.84 7h16.32" /></>} />;
}
