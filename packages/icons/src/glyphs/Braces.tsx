import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Braces(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" /><Path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" /></>} />;
}
