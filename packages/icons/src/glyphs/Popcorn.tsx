import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Popcorn(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4" /><Path d="M10 22 9 8" /><Path d="m14 22 1-14" /><Path d="M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z" /></>} />;
}
