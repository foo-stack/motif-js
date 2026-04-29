import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Touchpad(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="20" height="16" x="2" y="4" rx="2" /><Path d="M2 14h20" /><Path d="M12 20v-6" /></>} />;
}
