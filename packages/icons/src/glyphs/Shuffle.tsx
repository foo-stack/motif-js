import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Shuffle(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m18 14 4 4-4 4" /><Path d="m18 2 4 4-4 4" /><Path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" /><Path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" /><Path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" /></>} />;
}
