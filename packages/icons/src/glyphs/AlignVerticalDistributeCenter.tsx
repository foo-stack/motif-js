import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlignVerticalDistributeCenter(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M22 17h-3" /><Path d="M22 7h-5" /><Path d="M5 17H2" /><Path d="M7 7H2" /><Rect x="5" y="14" width="14" height="6" rx="2" /><Rect x="7" y="4" width="10" height="6" rx="2" /></>} />;
}
