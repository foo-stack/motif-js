import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BookKey(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M13 2H6.5A2.5 2.5 0 0 0 4 4.5v15" /><Path d="M17 2v6" /><Path d="M17 4h2" /><Path d="M20 15.2V21a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><Circle cx="17" cy="10" r="2" /></>} />;
}
