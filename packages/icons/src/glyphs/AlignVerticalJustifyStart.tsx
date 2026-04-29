import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlignVerticalJustifyStart(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="14" height="6" x="5" y="16" rx="2" /><Rect width="10" height="6" x="7" y="6" rx="2" /><Path d="M2 2h20" /></>} />;
}
