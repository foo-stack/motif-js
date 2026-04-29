import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PanelRightInactive(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="18" height="18" x="3" y="3" rx="2" /><Path d="M15 14v1" /><Path d="M15 19v2" /><Path d="M15 3v2" /><Path d="M15 9v1" /></>} />;
}
