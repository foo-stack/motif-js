import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SmartphoneCharging(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><Path d="M12.667 8 10 12h4l-2.667 4" /></>} />;
}
