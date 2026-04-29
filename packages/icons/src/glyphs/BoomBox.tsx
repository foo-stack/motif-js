import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BoomBox(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path, Rect }) => <><Path d="M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><Path d="M8 8v1" /><Path d="M12 8v1" /><Path d="M16 8v1" /><Rect width="20" height="12" x="2" y="9" rx="2" /><Circle cx="8" cy="15" r="2" /><Circle cx="16" cy="15" r="2" /></>} />;
}
