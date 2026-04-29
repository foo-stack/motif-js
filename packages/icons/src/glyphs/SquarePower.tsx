import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SquarePower(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M12 7v4" /><Path d="M7.998 9.003a5 5 0 1 0 8-.005" /><Rect x="3" y="3" width="18" height="18" rx="2" /></>} />;
}
