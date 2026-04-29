import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BrickWall(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="18" height="18" x="3" y="3" rx="2" /><Path d="M12 9v6" /><Path d="M16 15v6" /><Path d="M16 3v6" /><Path d="M3 15h18" /><Path d="M3 9h18" /><Path d="M8 15v6" /><Path d="M8 3v6" /></>} />;
}
