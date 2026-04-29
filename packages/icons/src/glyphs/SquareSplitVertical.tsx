import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SquareSplitVertical(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Line, Path }) => <><Path d="M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3" /><Path d="M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3" /><Line x1="4" x2="20" y1="12" y2="12" /></>} />;
}
