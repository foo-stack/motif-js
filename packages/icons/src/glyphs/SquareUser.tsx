import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SquareUser(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path, Rect }) => <><Rect width="18" height="18" x="3" y="3" rx="2" /><Circle cx="12" cy="10" r="3" /><Path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" /></>} />;
}
