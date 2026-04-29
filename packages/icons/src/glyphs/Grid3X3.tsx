import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Grid3X3(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="18" height="18" x="3" y="3" rx="2" /><Path d="M3 9h18" /><Path d="M3 15h18" /><Path d="M9 3v18" /><Path d="M15 3v18" /></>} />;
}
