import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlignHorizontalJustifyStart(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="6" height="14" x="6" y="5" rx="2" /><Rect width="6" height="10" x="16" y="7" rx="2" /><Path d="M2 2v20" /></>} />;
}
