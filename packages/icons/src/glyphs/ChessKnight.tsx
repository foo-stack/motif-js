import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChessKnight(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" /><Path d="M16.5 18c1-2 2.5-5 2.5-9a7 7 0 0 0-7-7H6.635a1 1 0 0 0-.768 1.64L7 5l-2.32 5.802a2 2 0 0 0 .95 2.526l2.87 1.456" /><Path d="m15 5 1.425-1.425" /><Path d="m17 8 1.53-1.53" /><Path d="M9.713 12.185 7 18" /></>} />;
}
