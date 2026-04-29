import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SquareArrowLeft(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="18" height="18" x="3" y="3" rx="2" /><Path d="m12 8-4 4 4 4" /><Path d="M16 12H8" /></>} />;
}
