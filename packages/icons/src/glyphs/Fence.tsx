import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Fence(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" /><Path d="M6 8h4" /><Path d="M6 18h4" /><Path d="m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" /><Path d="M14 8h4" /><Path d="M14 18h4" /><Path d="m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" /></>} />;
}
