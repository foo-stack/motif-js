import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChessBishop(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" /><Path d="M15 18c1.5-.615 3-2.461 3-4.923C18 8.769 14.5 4.462 12 2 9.5 4.462 6 8.77 6 13.077 6 15.539 7.5 17.385 9 18" /><Path d="m16 7-2.5 2.5" /><Path d="M9 2h6" /></>} />;
}
