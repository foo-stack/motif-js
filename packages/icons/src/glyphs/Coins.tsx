import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Coins(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" /><Path d="M15 6h1v4" /><Path d="m6.134 14.768.866-.5 2 3.464" /><Circle cx="16" cy="8" r="6" /></>} />;
}
