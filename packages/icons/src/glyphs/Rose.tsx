import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Rose(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M17 10h-1a4 4 0 1 1 4-4v.534" /><Path d="M17 6h1a4 4 0 0 1 1.42 7.74l-2.29.87a6 6 0 0 1-5.339-10.68l2.069-1.31" /><Path d="M4.5 17c2.8-.5 4.4 0 5.5.8s1.8 2.2 2.3 3.7c-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2" /><Path d="M9.77 12C4 15 2 22 2 22" /><Circle cx="17" cy="8" r="2" /></>} />;
}
