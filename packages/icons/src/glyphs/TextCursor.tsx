import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TextCursor(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1" /><Path d="M7 22h1a4 4 0 0 0 4-4v-1" /><Path d="M7 2h1a4 4 0 0 1 4 4v1" /></>} />;
}
