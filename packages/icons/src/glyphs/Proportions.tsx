import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Proportions(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="20" height="16" x="2" y="4" rx="2" /><Path d="M12 9v11" /><Path d="M2 9h13a2 2 0 0 1 2 2v9" /></>} />;
}
