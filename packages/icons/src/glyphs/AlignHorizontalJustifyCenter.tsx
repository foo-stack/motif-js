import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlignHorizontalJustifyCenter(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="6" height="14" x="2" y="5" rx="2" /><Rect width="6" height="10" x="16" y="7" rx="2" /><Path d="M12 2v20" /></>} />;
}
