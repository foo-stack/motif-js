import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MirrorRectangular(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M11 6 8 9" /><Path d="m16 7-8 8" /><Rect x="4" y="2" width="16" height="20" rx="2" /></>} />;
}
