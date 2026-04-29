import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlignEndVertical(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="16" height="6" x="2" y="4" rx="2" /><Rect width="9" height="6" x="9" y="14" rx="2" /><Path d="M22 22V2" /></>} />;
}
