import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TextCursorInput(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6" /><Path d="M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7" /><Path d="M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" /><Path d="M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1" /><Path d="M9 6v12" /></>} />;
}
