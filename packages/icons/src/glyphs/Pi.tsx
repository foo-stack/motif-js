import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Pi(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Line, Path }) => <><Line x1="9" x2="9" y1="4" y2="20" /><Path d="M4 7c0-1.7 1.3-3 3-3h13" /><Path d="M18 20c-1.7 0-3-1.3-3-3V4" /></>} />;
}
