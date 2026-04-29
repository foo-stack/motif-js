import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function HousePlug(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M10 12V8.964" /><Path d="M14 12V8.964" /><Path d="M15 12a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1z" /><Path d="M8.5 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-2" /></>} />;
}
