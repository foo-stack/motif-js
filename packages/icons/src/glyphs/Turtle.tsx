import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Turtle(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z" /><Path d="M4.82 7.9 8 10" /><Path d="M15.18 7.9 12 10" /><Path d="M16.93 10H20a2 2 0 0 1 0 4H2" /></>} />;
}
